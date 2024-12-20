import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';
import { AuthController } from '../../../../src/api/auth/auth.controller';
import { VCManagementApiFilters } from '../../../../src/api/filters/vc.api.filters';
import {
  ENS_MANAGER_SERVICE,
  IEnsManagerService,
} from '../../../../src/core/applications/ens-manager/iens-manager.service';
import { AuthenticationException } from '../../../../src/core/domain/exceptions/Authentication.exception';

const ENS = 'ENS';
const ADDRESS = 'ADDRESS';
const CHAINID = 11155111;
const MESSAGE = 'MESSAGE';
const SIGNATURE = 'SIGNATURE';
const SIGNATURE_2 = 'SIGNATURE_2';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const TOKEN = 'TOKEN';

describe('Auth controller integration tests', () => {
  let app: INestApplication;
  let ensManagerService: DeepMocked<IEnsManagerService>;
  let jwtService: DeepMocked<JwtService>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ...VCManagementApiFilters.map((filter) => ({
          provide: APP_FILTER,
          useClass: filter,
        })),
        {
          provide: ENS_MANAGER_SERVICE,
          useValue: createMock<IEnsManagerService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    ensManagerService =
      module.get<DeepMocked<IEnsManagerService>>(ENS_MANAGER_SERVICE);
    jwtService = module.get<DeepMocked<JwtService>>(JwtService);

    ensManagerService.signIn.mockImplementation(async (param) => {
      if (param.message === MESSAGE && param.signature === SIGNATURE) {
        return { ens: ENS, chainId: CHAINID, address: ADDRESS };
      }
      throw new AuthenticationException(ERROR_MESSAGE);
    });

    jwtService.sign.mockImplementation((payload) => {
      if (
        JSON.stringify(payload) ===
        JSON.stringify({ ens: ENS, address: ADDRESS, chainId: CHAINID })
      ) {
        return TOKEN;
      }
      throw new Error(ERROR_MESSAGE);
    });

    jwtService.verifyAsync.mockImplementation((payload) => {
      return Promise.resolve({ nonce: payload });
    });

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sign in endpoint tests', () => {
    it('should return 200 and a token when the sign in is successful', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .set('Cookie', `justverifiednonce=${TOKEN}`)
        .send({ message: MESSAGE, signature: SIGNATURE })
        .expect((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual({ ens: ENS, chainId: CHAINID, address: ADDRESS });
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
          expect(res.headers['set-cookie'][0]).toContain('Secure');
          expect(res.headers['set-cookie'][0]).toContain('SameSite=None');
          expect(res.headers['set-cookie'][1]).toContain('justverifiedtoken=' + TOKEN);
        });
    });

    it('should return 401 when sign in is unsuccessful', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ message: MESSAGE, signature: SIGNATURE_2 })
        .expect((res) => {
          expect(res.status).toBe(401);
        });
    });
  });
});
