import { Injectable } from '@nestjs/common';
import { IAuthControllerMapper } from './iauth.controller.mapper';
import { AuthCallbackApiResponse } from '../auth.callback.response.api';
import { CredentialCallbackResponse } from '../../../core/applications/credentials/facade/credential.callback.response';
import { AuthGetAuthUrlApiRequestQuery, AuthGetAuthUrlRequestApiRequestParam } from '../auth.get-auth-url.request.api';
import { CredentialCallbackRequest } from '../../../core/applications/credentials/facade/credential.callback.request';

@Injectable()
export class AuthControllerMapper implements IAuthControllerMapper {

  constructor() {}

  mapCredentialCallbackResponseToAuthCallbackApiResponse(
    credentialCallbackResponse: CredentialCallbackResponse,
  ): AuthCallbackApiResponse {
    return {
      dataKey: credentialCallbackResponse.dataKey,
      verifiedCredential: {
        type: credentialCallbackResponse.verifiableCredential.type,
        '@context': credentialCallbackResponse.verifiableCredential['@context'],
        credentialSubject: credentialCallbackResponse.verifiableCredential.credentialSubject,
        issuer: credentialCallbackResponse.verifiableCredential.issuer,
        proof: credentialCallbackResponse.verifiableCredential.proof,
        expirationDate: credentialCallbackResponse.verifiableCredential.expirationDate,
        issuanceDate: credentialCallbackResponse.verifiableCredential.issuanceDate,
      },
    }
  }

  mapAuthCallbackApiRequestToCredentialCallbackRequest(
    authCallbackApiRequestQuery: AuthGetAuthUrlApiRequestQuery,
    authCallbackApiRequestParams: AuthGetAuthUrlRequestApiRequestParam
  ): CredentialCallbackRequest {
    return {
      credentialName: authCallbackApiRequestParams.authName,
      callbackData: authCallbackApiRequestQuery
    }
  }
}
