import { Injectable } from '@nestjs/common';
import { IcredentialsControllerMapper } from './icredentials.controller.mapper';
import { AuthCallbackApiResponse } from '../responses/credentials.callback.response.api';
import { CredentialCallbackResponse } from '../../../core/applications/credentials/facade/credential.callback.response';
import { CredentialCallbackRequest } from '../../../core/applications/credentials/facade/credential.callback.request';
import {
  CredentialsGetAuthUrlApiRequestQuery,
  CredentialsGetAuthUrlRequestApiRequestParam
} from "../requests/credentials.get-auth-url.request.api";

@Injectable()
export class CredentialsControllerMapper implements IcredentialsControllerMapper {

  constructor() {}

  mapCredentialCallbackResponseToAuthCallbackApiResponse(
    credentialCallbackResponse: CredentialCallbackResponse,
  ): AuthCallbackApiResponse {
    return {
      dataKey: credentialCallbackResponse.dataKey,
      verifiableCredential: {
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
    authCallbackApiRequestQuery: CredentialsGetAuthUrlApiRequestQuery,
    authCallbackApiRequestParams: CredentialsGetAuthUrlRequestApiRequestParam
  ): CredentialCallbackRequest {
    return {
      credentialName: authCallbackApiRequestParams.authName,
      callbackData: authCallbackApiRequestQuery
    }
  }
}
