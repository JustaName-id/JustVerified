import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { EmailResolver } from '../../../../../../src/core/applications/credentials/facade/email-resolver/email.resolver';
import { EmailCallback } from '../../../../../../src/core/applications/credentials/facade/email-resolver/email.callback';
import { OTPException } from '../../../../../../src/core/domain/exceptions/OTP.exception';
import { IEmailSender } from '../../../../../../src/core/applications/email-sender/iemail-sender.service';
import { EMAIL_SENDER } from '../../../../../../src/core/applications/email-sender/iemail-sender.service';
import {
  CRYPTO_SERVICE,
  ICryptoService,
} from '../../../../../../src/core/applications/crypto/icrypto.service';
import {
  ENVIRONMENT_GETTER,
  IEnvironmentGetter,
} from '../../../../../../src/core/applications/environment/ienvironment.getter';
import {
  CREDENTIAL_CREATOR,
  ICredentialCreator,
} from '../../../../../../src/core/applications/credentials/creator/icredential.creator';
import {
  DID_RESOLVER,
  IDIDResolver,
} from '../../../../../../src/core/applications/did/resolver/idid.resolver';
import {
  TIME_GENERATOR,
  TimeGenerator,
} from '../../../../../../src/core/applications/time.generator';
import {
  ENS_MANAGER_SERVICE,
  IEnsManagerService,
} from '../../../../../../src/core/applications/ens-manager/iens-manager.service';

const GENERATED_OTP = '123456';
const GENERATED_OTP_2 = '654321';
const HASHED_OTP = Buffer.from(GENERATED_OTP);
const HASHED_OTP_2 = Buffer.from(GENERATED_OTP_2);

const ENCRYPTED_STATE = 'ENCRYPTED_STATE';
const EMAIL = 'EMAIL';
const AUTH_ID = 'AUTH_ID';
const AUTH_ID_2 = 'AUTH_ID_2';
const ENS = 'ENS';
const CURRENT_TIME = Date.now();
const EXPIRES_AT = CURRENT_TIME + 6 * 60 * 1000;

const getEmailCallback = (): EmailCallback => ({
  state: ENCRYPTED_STATE,
  otp: GENERATED_OTP,
});

const getOTPStore = (
  authId: string
): Map<string, { email: string; otpHash: Buffer; expiresAt: number }> => {
  const otpStore = new Map<
    string,
    { email: string; otpHash: Buffer; expiresAt: number }
  >();
  otpStore.set(authId, {
    email: EMAIL,
    otpHash: HASHED_OTP,
    expiresAt: EXPIRES_AT,
  });
  return otpStore;
};

describe('EmailResolver', () => {
  let emailResolver: EmailResolver;
  let cryptoEncryption: DeepMocked<ICryptoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailResolver,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        {
          provide: DID_RESOLVER,
          useValue: createMock<IDIDResolver>(),
        },
        {
          provide: TIME_GENERATOR,
          useValue: createMock<TimeGenerator>(),
        },
        {
          provide: EMAIL_SENDER,
          useValue: createMock<IEmailSender>(),
        },
        {
          provide: CRYPTO_SERVICE,
          useValue: createMock<ICryptoService>(),
        },
        {
          provide: CRYPTO_SERVICE,
          useValue: createMock<ICryptoService>(),
        },
        {
          provide: ENS_MANAGER_SERVICE,
          useValue: createMock<IEnsManagerService>(),
        },
        {
          provide: ENVIRONMENT_GETTER,
          useValue: createMock<IEnvironmentGetter>(),
        },
        {
          provide: CREDENTIAL_CREATOR,
          useValue: createMock<ICredentialCreator>(),
        },
      ],
    }).compile();

    emailResolver = module.get<EmailResolver>(EmailResolver);
    cryptoEncryption = module.get<DeepMocked<ICryptoService>>(CRYPTO_SERVICE);

    cryptoEncryption.decrypt.mockReturnValue(
      JSON.stringify({ ens: ENS, authId: AUTH_ID })
    );

    emailResolver.otpStore = getOTPStore(AUTH_ID);

    cryptoEncryption.timingSafeEqual.mockImplementationOnce(
      (firstHash, secondHash) => {
        if (firstHash.equals(HASHED_OTP_2) && secondHash.equals(HASHED_OTP)) {
          return false;
        }
        return true;
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractCredentialSubject method tests', () => {
    it('should throw an exception when the otp data is not found', async () => {
      emailResolver.otpStore = getOTPStore(AUTH_ID_2);

      await expect(
        emailResolver.extractCredentialSubject(getEmailCallback())
      ).rejects.toThrow(OTPException.notFound());
    });

    it('should throw an exception when the otp data is expired', async () => {
      jest.spyOn(Date, 'now').mockReturnValueOnce(EXPIRES_AT + 1);

      await expect(
        emailResolver.extractCredentialSubject(getEmailCallback())
      ).rejects.toThrow(OTPException.expired());
    });

    it('should throw an exception when the otp is invalid', async () => {
      cryptoEncryption.createHash.mockReturnValue(HASHED_OTP_2);

      await expect(
        emailResolver.extractCredentialSubject(getEmailCallback())
      ).rejects.toThrow(OTPException.invalid());
    });
  });

  describe('resendOtp method test', () => {
    it('should throw an exception when the otp data is not found', async () => {
      emailResolver.otpStore = getOTPStore(AUTH_ID_2);

      await expect(emailResolver.resendOtp(ENCRYPTED_STATE)).rejects.toThrow(
        OTPException.notFound()
      );
    });
  });
});
