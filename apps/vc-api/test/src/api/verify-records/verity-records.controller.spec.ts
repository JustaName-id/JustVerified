import request from 'supertest';
import { APP_FILTER } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { VCManagementApiFilters } from '../../../../src/api/filters/vc.api.filters';
import { IVerifyRecordsControllerMapper } from '../../../../src/api/verify-records/mapper/iverify-records.controller.mapper';
import { VerifyRecordsController } from '../../../../src/api/verify-records/verify-records.controller';
import { VerifyRecordsApiRequest } from '../../../../src/api/verify-records/requests/verify-records.api.request';
import { SocialCredentials } from '../../../../src/core/domain/entities/credentials';
import { VerifyRecordsRequest } from '../../../../src/core/applications/verify-records/requests/verify-records.request';
import { VerifyRecordsApiResponse } from '../../../../src/api/verify-records/responses/verify-records.api.response';
import { VerifyRecordsResponse } from '../../../../src/core/applications/verify-records/response/verify-records.response';
import { ChainIdInvalidException } from '../../../../src/core/domain/exceptions/ChainIdInvalid.exception';
import {
  IVerifyRecordsService,
  VERIFY_RECORDS_SERVICE,
} from '../../../../src/core/applications/verify-records/iverify-records.service';

const ENS = 'ENS';
const ERROR_MESSAGE = 'ERROR_MESSAGE';
const SOCIAL_CREDENTIAL: SocialCredentials = 'github';
const CHAIN_ID = 11155111;
const CHAIN_ID_2 = 31337;
const ISSUER = 'ISSUER';

const RECORD_KEY = 'RECORD_KEY';
const RECORD_VALUE = true;

const getVerifyRecordsApiRequest = (): VerifyRecordsApiRequest => ({
  ens: ENS,
  chainId: CHAIN_ID,
  credentials: [SOCIAL_CREDENTIAL],
  issuer: ISSUER,
});

const getVerifyRecordsRequest = (
  chainId: number = CHAIN_ID
): VerifyRecordsRequest => ({
  ens: ENS,
  chainId,
  credentials: [SOCIAL_CREDENTIAL],
  issuer: ISSUER,
});

const getVerifyRecordsResponse = (): VerifyRecordsResponse => ({
  [RECORD_KEY]: RECORD_VALUE,
});

const getVerifyRecordsApiResponse = (): VerifyRecordsApiResponse => ({
  records: {
    [RECORD_KEY]: RECORD_VALUE,
  },
});

describe('Verify records controller integration tests', () => {
  let app: INestApplication;
  let verifyRecordsService: DeepMocked<IVerifyRecordsService>;
  let verifyRecordsControllerMapper: DeepMocked<IVerifyRecordsControllerMapper>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyRecordsController],
      providers: [
        ...VCManagementApiFilters.map((filter) => ({
          provide: APP_FILTER,
          useClass: filter,
        })),
        {
          provide: VERIFY_RECORDS_SERVICE,
          useValue: createMock<IVerifyRecordsService>(),
        },
        {
          provide: 'VERIFY_RECORDS_CONTROLLER_MAPPER',
          useValue: createMock<IVerifyRecordsControllerMapper>(),
        },
      ],
    }).compile();

    verifyRecordsService = module.get<DeepMocked<IVerifyRecordsService>>(
      VERIFY_RECORDS_SERVICE
    );

    verifyRecordsControllerMapper = module.get<
      DeepMocked<IVerifyRecordsControllerMapper>
    >('VERIFY_RECORDS_CONTROLLER_MAPPER');

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Verify records endpoint tests', () => {
    it('should return a response with the correct data', async () => {
      verifyRecordsControllerMapper.mapVerifyRecordsApiRequestToVerifyRecordsRequest.mockImplementationOnce(
        (param) => {
          if (
            JSON.stringify(param) ===
            JSON.stringify({
              ...getVerifyRecordsApiRequest(),
              chainId: CHAIN_ID.toString(),
              credentials: SOCIAL_CREDENTIAL,
            })
          ) {
            return getVerifyRecordsRequest();
          }
          throw new Error(ERROR_MESSAGE);
        }
      );

      verifyRecordsService.verifyRecords.mockImplementationOnce((param) => {
        if (
          JSON.stringify(param) === JSON.stringify(getVerifyRecordsRequest())
        ) {
          return Promise.resolve(getVerifyRecordsResponse());
        }

        throw new Error(ERROR_MESSAGE);
      });

      verifyRecordsControllerMapper.mapVerifyRecordsResponseToVerifyRecordsApiResponse.mockImplementationOnce(
        (param) => {
          if (
            JSON.stringify(param) === JSON.stringify(getVerifyRecordsResponse())
          ) {
            return getVerifyRecordsApiResponse();
          }

          throw new Error(ERROR_MESSAGE);
        }
      );

      await request(app.getHttpServer())
        .get('/verify-records')
        .query(getVerifyRecordsApiRequest())
        .expect((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual(getVerifyRecordsApiResponse());
        });
    });
  });

  it('should return 400 status code if provided chain id is not found', async () => {
    verifyRecordsControllerMapper.mapVerifyRecordsApiRequestToVerifyRecordsRequest.mockImplementationOnce(
      (param) => {
        if (
          JSON.stringify(param) ===
          JSON.stringify({
            ...getVerifyRecordsApiRequest(),
            chainId: CHAIN_ID_2.toString(),
            credentials: SOCIAL_CREDENTIAL,
          })
        ) {
          return getVerifyRecordsRequest(CHAIN_ID_2);
        }
        throw new Error(ERROR_MESSAGE);
      }
    );

    verifyRecordsService.verifyRecords.mockImplementationOnce((param) => {
      if (
        JSON.stringify(param) ===
        JSON.stringify(getVerifyRecordsRequest(CHAIN_ID_2))
      ) {
        throw ChainIdInvalidException.withId(CHAIN_ID_2);
      }

      return Promise.resolve(getVerifyRecordsResponse());
    });

    await request(app.getHttpServer())
      .get('/verify-records')
      .query({ ...getVerifyRecordsApiRequest(), chainId: CHAIN_ID_2 })
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          message: ChainIdInvalidException.withId(CHAIN_ID_2).message,
        });
      });
  });
});
