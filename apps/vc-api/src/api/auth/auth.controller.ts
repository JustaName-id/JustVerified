import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import {
  CREDENTIAL_CREATOR_FACADE,
  ICredentialCreatorFacade
} from '../../core/applications/credentials/facade/icredential.facade';
import { Response } from 'express';
import { AuthCallbackApiResponse } from './auth.callback.response.api';
import { AUTH_CONTROLLER_MAPPER, IAuthControllerMapper } from './mapper/iauth.controller.mapper';
import { AuthGetAuthUrlRequestApiRequestParam } from './auth.get-auth-url.request.api';
@Controller('auth')
export class AuthController {

  constructor(
    @Inject(CREDENTIAL_CREATOR_FACADE)
    private readonly credentialCreatorFacade: ICredentialCreatorFacade,

    @Inject(AUTH_CONTROLLER_MAPPER)
    private readonly authControllerMapper: IAuthControllerMapper
  ) {}

  @Get('')
  async welcomeToJustaNameVerifications(): Promise<string[]> {
    return ['Welcome to JustaName Verifications! Please use the /auth/:authName endpoint to get started.']
  }

  @Get(':authName')
  async getAuthUrl(
    @Param() authGetAuthUrlRequestApi: AuthGetAuthUrlRequestApiRequestParam,
    @Res() res: Response
  ): Promise<void> {
    const redirect = await this.credentialCreatorFacade.getAuthUrl(authGetAuthUrlRequestApi.authName)
    if(redirect.startsWith('http')) {
      res.redirect(redirect)
      return
    }
    res.send(redirect)
  }

  @Get(':authName/callback')
  async callback(
    @Param() authGetAuthUrlRequestApiParam: AuthGetAuthUrlRequestApiRequestParam,
    @Query() authGetAuthUrlRequestApiQuery: any,
  ): Promise<AuthCallbackApiResponse> {
    const verifiedEthereumEip712Signature2021 = await this.credentialCreatorFacade.callback(
      this.authControllerMapper.mapAuthCallbackApiRequestToCredentialCallbackRequest(
        authGetAuthUrlRequestApiQuery,
        authGetAuthUrlRequestApiParam)
    )
    return this.authControllerMapper.mapCredentialCallbackResponseToAuthCallbackApiResponse(verifiedEthereumEip712Signature2021)
  }
}
