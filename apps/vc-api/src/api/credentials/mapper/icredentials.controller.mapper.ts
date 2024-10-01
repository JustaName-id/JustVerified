import { AuthCallbackApiResponse } from '../responses/credentials.callback.response.api';
import { CredentialCallbackResponse } from '../../../core/applications/credentials/facade/credential.callback.response';
import { CredentialCallbackRequest } from '../../../core/applications/credentials/facade/credential.callback.request';
import {
  CredentialsGetAuthUrlApiRequestQuery,
  CredentialsGetAuthUrlRequestApiRequestParam
} from "../requests/credentials.get-auth-url.request.api";

export const AUTH_CONTROLLER_MAPPER = 'AUTH_CONTROLLER_MAPPER';

export interface IcredentialsControllerMapper {
  mapCredentialCallbackResponseToAuthCallbackApiResponse(
    credentialCallbackResponse: CredentialCallbackResponse,
  ): AuthCallbackApiResponse;

  mapAuthCallbackApiRequestToCredentialCallbackRequest(
    authCallbackApiRequestQuery: CredentialsGetAuthUrlApiRequestQuery,
    authCallbackApiRequestParams: CredentialsGetAuthUrlRequestApiRequestParam
  ): CredentialCallbackRequest;
}
