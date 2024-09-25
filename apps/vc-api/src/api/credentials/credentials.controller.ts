import { Controller, Get, Inject, Param, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import {
  CREDENTIAL_CREATOR_FACADE,
  ICredentialCreatorFacade
} from '../../core/applications/credentials/facade/icredential.facade';
import { Response } from 'express';
import { AUTH_CONTROLLER_MAPPER, IcredentialsControllerMapper } from './mapper/icredentials.controller.mapper';
import { CredentialsGetAuthUrlRequestApiRequestParam } from './credentials.get-auth-url.request.api';
import { v4 as uuidv4 } from 'uuid';
import { filter, Subject, take } from 'rxjs';
import { SubjectData } from './isubject.data';
import { JwtGuard } from '../../guards/jwt.guard';

type Siwj = { address: string, ens: string };

@Controller('credentials')
export class CredentialsController {

  private authSubjects: Map<string, Subject<SubjectData>> = new Map();

  constructor(
    @Inject(CREDENTIAL_CREATOR_FACADE)
    private readonly credentialCreatorFacade: ICredentialCreatorFacade,

    @Inject(AUTH_CONTROLLER_MAPPER)
    private readonly authControllerMapper: IcredentialsControllerMapper
  ) {}

  @Get('')
  async welcomeToJustaNameVerifications(): Promise<string[]> {
    return ['Welcome to JustaName Verifications! Please use the /auth/:authName endpoint to get started.']
  }

  @UseGuards(JwtGuard)
  @Get(':authName')
  async getAuthUrl(
    @Param() authGetAuthUrlRequestApi: CredentialsGetAuthUrlRequestApiRequestParam,
    @Res() res: Response,
    @Req() req: Request & { user: Siwj }
  ): Promise<any> {

    const authId = uuidv4();
    const subject = new Subject<SubjectData>();
    this.authSubjects.set(authId, subject);

    const redirectUrl = await this.credentialCreatorFacade.getAuthUrl(
      authGetAuthUrlRequestApi.authName,
      req.user?.ens,
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

  @Get(':authName/callback')
  async callback(
    @Param() authGetAuthUrlRequestApiParam: CredentialsGetAuthUrlRequestApiRequestParam,
    @Query() authGetAuthUrlRequestApiQuery: any,
    @Res() res: Response
  ): Promise<void> {
    try {
      const verifiedEthereumEip712Signature2021 = await this.credentialCreatorFacade.callback(
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
    }catch(e){

    }


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
}
