import { AuthCallbackApiResponse } from '../auth.callback.response.api';
import { CredentialCallbackResponse } from '../../../core/applications/credentials/facade/credential.callback.response';
import { AuthGetAuthUrlApiRequestQuery, AuthGetAuthUrlRequestApiRequestParam } from '../auth.get-auth-url.request.api';
import { CredentialCallbackRequest } from '../../../core/applications/credentials/facade/credential.callback.request';

export const AUTH_CONTROLLER_MAPPER = 'AUTH_CONTROLLER_MAPPER';

export interface IAuthControllerMapper {
  mapCredentialCallbackResponseToAuthCallbackApiResponse(
    credentialCallbackResponse: CredentialCallbackResponse,
  ): AuthCallbackApiResponse;

  mapAuthCallbackApiRequestToCredentialCallbackRequest(
    authCallbackApiRequestQuery: AuthGetAuthUrlApiRequestQuery,
    authCallbackApiRequestParams: AuthGetAuthUrlRequestApiRequestParam
  ): CredentialCallbackRequest;
}
