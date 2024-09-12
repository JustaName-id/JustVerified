import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import {
  CREDENTIAL_CREATOR_FACADE,
  ICredentialCreatorFacade
} from '../../core/applications/credentials/facade/icredential.facade';
import { AuthGetAuthUrlRequestApi, AuthGetAuthUrlRequestQueryApi } from './auth.get-auth-url.request.api';
import { Response } from 'express';
@Controller('auth')
export class AuthReadController {

  constructor(
    @Inject(CREDENTIAL_CREATOR_FACADE)
    private readonly credentialCreatorFacade: ICredentialCreatorFacade,
  ) {}

  @Get(':authName')
  async getAuthUrl(
    @Param() authGetAuthUrlRequestApi: AuthGetAuthUrlRequestApi,
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
    @Param() authGetAuthUrlRequestApi: AuthGetAuthUrlRequestApi,
    @Query() query: AuthGetAuthUrlRequestQueryApi,
    @Res() res: Response
  ): Promise<void> {
    const url = await this.credentialCreatorFacade.callback(authGetAuthUrlRequestApi.authName, query)
    res.status(200).send('Success')
  }
}
