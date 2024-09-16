import { AuthCallbackApiResponse } from '../credentials.callback.response.api';
import { CredentialCallbackResponse } from '../../../core/applications/credentials/facade/credential.callback.response';
import { CredentialsGetAuthUrlApiRequestQuery, CredentialsGetAuthUrlRequestApiRequestParam } from '../credentials.get-auth-url.request.api';
import { CredentialCallbackRequest } from '../../../core/applications/credentials/facade/credential.callback.request';

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
