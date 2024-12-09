import {Body, Controller, Get, Inject, Param, Post, Query, Req, Res, Session, UseGuards} from '@nestjs/common';
import {
  CREDENTIAL_CREATOR_FACADE,
  ICredentialCreatorFacade
} from '../../core/applications/credentials/facade/icredential.facade';
import { Response } from 'express';
import { AUTH_CONTROLLER_MAPPER, IcredentialsControllerMapper } from './mapper/icredentials.controller.mapper';
import { v4 as uuidv4 } from 'uuid';
import { filter, Subject, take } from 'rxjs';
import { SubjectData } from './isubject.data';
import { JwtGuard } from '../../guards/jwt.guard';
import {CredentialsGenerateEmailOtpApiRequestQuery} from "./requests/credentials.generate-email-otp.request.api";
import {CredentialsGetAuthUrlRequestApiRequestParam} from "./requests/credentials.get-auth-url.request.api";
import {CredentialsGenerateEmailResponseApi} from "./responses/credentials.generate.email.response.api";
import {CredentialsResendOtpRequestApi} from "./requests/credentials.resend-otp.request.api";
import {CredentialsVerifyOtpRequestApi} from "./requests/credentials.verify-otp.request.api";
import {CredentialsClearEmailRequestApi} from "./requests/credentials.clear-email.request.api";
import {AuthCallbackApiResponse} from "./responses/credentials.callback.response.api";
import { ChainId } from '../../core/domain/entities/environment';

type Siwens = { address: string, ens: string, chainId: ChainId };

@Controller('credentials')
export class CredentialsController {

  private authSubjects: Map<string, Subject<SubjectData>> = new Map();

  constructor(
    @Inject(CREDENTIAL_CREATOR_FACADE)
    private readonly credentialCreatorFacade: ICredentialCreatorFacade,

    @Inject(AUTH_CONTROLLER_MAPPER)
    private readonly authControllerMapper: IcredentialsControllerMapper
  ) {}

  // @UseGuards(JwtGuard)
  @Get('socials/:authName')
  async getAuthUrl(
    @Param() authGetAuthUrlRequestApi: CredentialsGetAuthUrlRequestApiRequestParam,
    @Res() res: Response,
    @Req() req: Request & { user: Siwens }
  ): Promise<any> {

    const authId = uuidv4();
    const subject = new Subject<SubjectData>();
    this.authSubjects.set(authId, subject);

    const redirectUrl = await this.credentialCreatorFacade.getSocialAuthUrl(
      authGetAuthUrlRequestApi.authName,
      req.user?.ens,
      req.user?.chainId,
      authId
    )


    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    res.write(`data: ${JSON.stringify({ redirectUrl })}\n\n`);

    subject.pipe(
      filter(data => data.authId === authId),
      take(1)
    ).subscribe(
      (data) => {
        res.write(`data: ${JSON.stringify({ result:data.result })}\n\n`);
        res.end();
        this.authSubjects.delete(authId);
      },
      (error) => {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
        this.authSubjects.delete(authId);
      }
    );
  }

  @Get('socials/:authName/callback')
  async callback(
    @Param() authGetAuthUrlRequestApiParam: CredentialsGetAuthUrlRequestApiRequestParam,
    @Query() authGetAuthUrlRequestApiQuery: any,
    @Res() res: Response
  ): Promise<void> {

    const verifiedEthereumEip712Signature2021 = await this.credentialCreatorFacade.socialCallback(
      this.authControllerMapper.mapAuthCallbackApiRequestToCredentialCallbackRequest(
        authGetAuthUrlRequestApiQuery,
        authGetAuthUrlRequestApiParam)
    )

    const { authId, dataKey, verifiableCredential } = verifiedEthereumEip712Signature2021

    const subject = this.authSubjects.get(authId);
    subject?.next({
      authId,
      result: {
        verifiableCredential,
        dataKey
      }
    });

    res.send(`
    <html>
      <body>
        <script>
          window.close();
          // In case window.close() doesn't work (e.g., in some browsers where the window wasn't opened by script)
          document.body.innerHTML = "Authentication successful. You can close this tab.";
        </script>
      </body>
    </html>
  `);
  }


  @UseGuards(JwtGuard)
  @Get("email")
  async generateEmailOtp(
    @Query() query: CredentialsGenerateEmailOtpApiRequestQuery,
    @Req() req: Request & { user: Siwens }
  ): Promise<CredentialsGenerateEmailResponseApi>{
    const authId = uuidv4();
    const subject = new Subject<SubjectData>();
    this.authSubjects.set(authId, subject);

    const state = await this.credentialCreatorFacade.getEmailOTP(
      query.email,
      req.user?.ens,
      req.user?.chainId,
      authId
    )

    return {
      state
    }
  }


  @UseGuards(JwtGuard)
  @Post("email/resend")
  async resendEmailOtp(
    @Body() body: CredentialsResendOtpRequestApi,
  ): Promise<void>{
    await this.credentialCreatorFacade.resendOtp(
      body.state
    )
  }

  @UseGuards(JwtGuard)
  @Post("email/verify")
  async verifyEmailOtp(
    @Body() body: CredentialsVerifyOtpRequestApi,
  ): Promise<AuthCallbackApiResponse>{
    const { dataKey, verifiableCredential, authId} = await this.credentialCreatorFacade.callbackEmailOTP({
      state: body.state,
      otp: body.otp
    })

    this.authSubjects.delete(authId);

    return this.authControllerMapper.mapCredentialCallbackResponseToAuthCallbackApiResponse({
      dataKey,
      verifiableCredential,
      authId
    })
  }

  @UseGuards(JwtGuard)
  @Post("email/clear")
  async clearEmailState(
    @Body() body: CredentialsClearEmailRequestApi,
  ): Promise<void>{
    const authId = this.credentialCreatorFacade.clearState(
      body.state
    )

    this.authSubjects.delete(authId);
  }
}
