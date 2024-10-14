import request from 'supertest';
import { Test } from '@nestjs/testing';
import { APP_FILTER } from '@nestjs/core';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';
import { VCManagementApiFilters } from '../../../../src/api/filters/vc.api.filters';
import {
  CREDENTIAL_CREATOR_FACADE,
  ICredentialCreatorFacade,
} from '../../../../src/core/applications/credentials/facade/icredential.facade';
import {
  AUTH_CONTROLLER_MAPPER,
  IcredentialsControllerMapper,
} from '../../../../src/api/credentials/mapper/icredentials.controller.mapper';
import { CredentialsController } from '../../../../src/api/credentials/credentials.controller';
import { JwtGuard } from '../../../../src/guards/jwt.guard';
import { EmailSenderException } from '../../../../src/core/domain/exceptions/EmailSender.exception';
import { JwtService } from '@nestjs/jwt';
import { SocialResolverNotFoundException } from '../../../../src/core/domain/exceptions/SocialResolverNotFound.exception';

const ENS = 'ENS';
const ADDRESS = 'ADDRESS';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const EMAIL = 'EMAIL';
const STATE = 'STATE';
const SOCIAL = 'SOCIAL';

const setupJwtGuard = () => {
  jest
    .spyOn(JwtGuard.prototype, 'canActivate')
    .mockImplementation((context) => {
      const request = context.switchToHttp().getRequest();
      request.user = { ens: ENS, address: ADDRESS };
      return Promise.resolve(true);
    });
};

describe('Credentials controller integration tests', () => {
  let app: INestApplication;
  let credentialCreatorFacade: DeepMocked<ICredentialCreatorFacade>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [CredentialsController],
      providers: [
        ...VCManagementApiFilters.map((filter) => ({
          provide: APP_FILTER,
          useClass: filter,
        })),
        {
          provide: CREDENTIAL_CREATOR_FACADE,
          useValue: createMock<ICredentialCreatorFacade>(),
        },
        {
          provide: AUTH_CONTROLLER_MAPPER,
          useValue: createMock<IcredentialsControllerMapper>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    credentialCreatorFacade = module.get<DeepMocked<ICredentialCreatorFacade>>(
      CREDENTIAL_CREATOR_FACADE
    );

    setupJwtGuard();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('get social auth url endpoint tests', () => {
    it('should return 404 status code if social resolver is not found', async () => {
      credentialCreatorFacade.getSocialAuthUrl.mockImplementationOnce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (authName, _ens, __authId) => {
          if (authName === SOCIAL) {
            throw new SocialResolverNotFoundException(SOCIAL);
          }
          return Promise.resolve(STATE);
        }
      );

      await request(app.getHttpServer())
        .get(`/credentials/socials/${SOCIAL}`)
        .expect(404);
    });
  });

  describe('generate email otp endpoint tests', () => {
    it('should return 500 status code if email sender exception was thrown', async () => {
      credentialCreatorFacade.getEmailOTP.mockImplementationOnce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (email, ens, _authId) => {
          if (email === EMAIL && ens === ENS) {
            throw new EmailSenderException(ERROR_MESSAGE);
          }
          return Promise.resolve(STATE);
        }
      );

      await request(app.getHttpServer())
        .get('/credentials/email')
        .query({ email: EMAIL })
        .expect((res) => {
          expect(res.status).toBe(502);
          expect(res.body.message).toBe(ERROR_MESSAGE);
        });
    });
  });
});
