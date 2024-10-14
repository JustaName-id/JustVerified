import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ENVIRONMENT_GETTER } from '../../../../src/core/applications/environment/ienvironment.getter';
import { IEnvironmentGetter } from '../../../../src/core/applications/environment/ienvironment.getter';
import { IKeyManagementFetcher } from '../../../../src/core/applications/key-management/ikey-management.fetcher';
import { KEY_MANAGEMENT_FETCHER } from '../../../../src/core/applications/key-management/ikey-management.fetcher';
import { JustaNameInitializerService } from '../../../../src/external/justaname-initializer/justaname-initializer.service';
import { SignInResponse } from '../../../../src/core/applications/ens-manager/responses/sign-in.response';
import { SignInRequest } from '../../../../src/core/applications/ens-manager/requests/sign-in.request';
import { AuthenticationException } from '../../../../src/core/domain/exceptions/Authentication.exception';
import { JustaNameInitializerException } from '../../../../src/core/domain/exceptions/JustaNameInitializer.exception';
import {
  CredentialSubject,
  EthereumEip712Signature2021,
  VerifiableEthereumEip712Signature2021,
} from '../../../../src/core/domain/entities/ethereumEip712Signature';

const MESSAGE = 'MESSAGE';
const SIGNATURE = 'SIGNATURE';
const ADDRESS = 'ADDRESS';
const ENS = 'ENS';

const ERROR_MESSAGE = 'ERROR_MESSAGE';

const CHAIN_ID = 11155111;
const SIWE_DOMAIN = 'SIWE_DOMAIN';
const SIWE_ORIGIN = 'SIWE_ORIGIN';
const ENS_DOMAIN = 'ENS_DOMAIN';
const INFURA_PROJECT_ID = 'INFURA_PROJECT_ID';

const CREDENTIAL_SUBJUECT = new CredentialSubject();
const ISSUANCE_DATE = new Date();
const EXPIRATION_DATE = new Date(
  ISSUANCE_DATE.setFullYear(ISSUANCE_DATE.getFullYear() + 1)
);
const CONTEXT = 'CONTEXT';
const TYPE = 'TYPE';
const FIELD = 'FIELD';

const getSignInRequest = (): SignInRequest => ({
  message: MESSAGE,
  signature: SIGNATURE,
});

const getSignInResponse = (): SignInResponse => ({
  address: ADDRESS,
  ens: ENS,
  chainId: CHAIN_ID,
});

const getEthereumEip712Signature2021 = (): EthereumEip712Signature2021 => {
  return new EthereumEip712Signature2021({
    credentialSubject: CREDENTIAL_SUBJUECT,
    issuanceDate: ISSUANCE_DATE,
    expirationDate: EXPIRATION_DATE,
    context: [CONTEXT],
    type: [TYPE],
  });
};

describe('JustaName initializer service', () => {
  let justaNameInitializerService: JustaNameInitializerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JustaNameInitializerService,
        {
          provide: ENVIRONMENT_GETTER,
          useValue: createMock<IEnvironmentGetter>({
            getEnsDomain: jest.fn().mockReturnValue(ENS_DOMAIN),
            getInfuraProjectId: jest.fn().mockReturnValue(INFURA_PROJECT_ID),
          }),
        },
        {
          provide: KEY_MANAGEMENT_FETCHER,
          useValue: createMock<IKeyManagementFetcher>(),
        },
      ],
    }).compile();

    justaNameInitializerService = module.get<JustaNameInitializerService>(
      JustaNameInitializerService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(justaNameInitializerService).toBeDefined();
  });

  describe('signIn method tests', () => {
    it('should throw an Authentication exception when the sign in fails', async () => {
      jest
        .spyOn(justaNameInitializerService.justaname.signIn, 'signIn')
        .mockRejectedValue(new Error(ERROR_MESSAGE));

      await expect(
        justaNameInitializerService.signIn(getSignInRequest())
      ).rejects.toThrow(
        AuthenticationException.withError(new Error(ERROR_MESSAGE))
      );
    });
  });

  describe('getRecords method tests', () => {
    it('should throw a JustaNameInitializer exception when getRecords fails', async () => {
      jest
        .spyOn(
          justaNameInitializerService.justaname.subnames,
          'getRecordsByFullName'
        )
        .mockRejectedValue(new Error(ERROR_MESSAGE));

      await expect(
        justaNameInitializerService.getRecords({
          chainId: CHAIN_ID,
          ens: ENS,
        })
      ).rejects.toThrow(
        JustaNameInitializerException.withError(new Error(ERROR_MESSAGE))
      );
    });
  });

  describe('appendVcInMAppEnabledEns', () => {
    it('should throw a JustaNameInitializer exception when an error occurs', async () => {
      jest
        .spyOn(
          justaNameInitializerService.justaname.mApps,
          'requestAppendMAppFieldChallenge'
        )
        .mockRejectedValue(new Error(ERROR_MESSAGE));

      await expect(
        justaNameInitializerService.appendVcInMAppEnabledEns(
          ENS,
          {} as VerifiableEthereumEip712Signature2021,
          FIELD
        )
      ).rejects.toThrow(
        JustaNameInitializerException.withError(new Error(ERROR_MESSAGE))
      );
    });
  });
});
