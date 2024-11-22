import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { VerifyRecordsControllerMapper } from "../../../../../src/api/verify-records/mapper/verify-records.controller.mapper";
import { VerifyRecordsApiRequest } from "../../../../../src/api/verify-records/requests/verify-records.api.request";
import { VerifyRecordsRequest } from "../../../../../src/core/applications/verify-records/requests/verify-records.request";
import { VerifyRecordsResponse } from "../../../../../src/core/applications/verify-records/response/verify-records.response";
import { VerifyRecordsApiResponse } from "../../../../../src/api/verify-records/responses/verify-records.api.response";
const ENS = 'ENS';
const CREDENTIALS = 'github';
const ISSUER = 'ISSUER';
const MATCH_STANDARD = true;
const SUBNAME = 'SUBNAME';
const RECORDS = {
    'RECORD_1': true,
};
const PROVIDER_URL = 'PROVIDER_URL';

const getVerifyRecordsApiRequest = (): VerifyRecordsApiRequest => {
    return {
        ens: [ENS],
        credentials: [CREDENTIALS],
        issuer: ISSUER,
        matchStandard: MATCH_STANDARD,
        providerUrl: PROVIDER_URL
    };
};

const getVerifyRecordsRequest = (): VerifyRecordsRequest => {
    return {
        ens: [ENS],
        credentials: [CREDENTIALS],
        issuer: ISSUER,
        matchStandard: MATCH_STANDARD,
        providerUrl: PROVIDER_URL
    };
};

const getVerifyRecordsResponse = (): VerifyRecordsResponse => {
    return {
        subname: SUBNAME,
        records: RECORDS
    };
};

const getVerifyRecordsApiResponse = (): VerifyRecordsApiResponse => {
    return {
        subname: SUBNAME,
        records: RECORDS
    };
};

describe('Verify records controller mapper', () => {
    let app: INestApplication;
    let verifyRecordsControllerMapper: VerifyRecordsControllerMapper;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VerifyRecordsControllerMapper]
        }).compile();

        verifyRecordsControllerMapper = module.get<VerifyRecordsControllerMapper>(VerifyRecordsControllerMapper);
    });

    describe('mapVerifyRecordsApiRequestToVerifyRecordsRequest method tests', () => {
        it('should map the verify records api request to the verify records request', () => {
            const verifyRecordsApiRequest = getVerifyRecordsApiRequest();
            const verifyRecordsRequest = verifyRecordsControllerMapper.mapVerifyRecordsApiRequestToVerifyRecordsRequest(verifyRecordsApiRequest);

            expect(verifyRecordsRequest).toEqual(getVerifyRecordsRequest());
        });
    });

    describe('mapVerifyRecordsResponsesToVerifyRecordsApiResponses method tests', () => {
        it('should map the verify records responses to the verify records api responses', () => {
            const verifyRecordsResponses = [getVerifyRecordsResponse()];
            const verifyRecordsApiResponses = verifyRecordsControllerMapper.mapVerifyRecordsResponsesToVerifyRecordsApiResponses(verifyRecordsResponses);

            expect(verifyRecordsApiResponses).toEqual([getVerifyRecordsApiResponse()]);
        });
    });
});
