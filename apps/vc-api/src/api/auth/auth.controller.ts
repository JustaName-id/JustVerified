import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JustaName } from '@justaname.id/sdk';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { AuthSigninApiRequest } from './requests/auth.signin.api.request';
import { Response, Request} from 'express';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';
import { JwtGuard } from '../../guards/jwt.guard';

type Siwj = { address: string, subname: string };

@Controller('auth')
export class AuthController {

  justaname: JustaName
  constructor(
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,

    private readonly jwtService: JwtService
  ) {
    this.justaname = JustaName.init({
      config: {
        chainId: this.environmentGetter.getChainId(),
        domain: this.environmentGetter.getSiweDomain(),
        origin:this.environmentGetter.getSiweOrigin(),
      },
      ensDomain: this.environmentGetter.getEnsDomain(),
      providerUrl: 'https://sepolia.infura.io/v3/' +this.environmentGetter.getInfuraProjectId()
    })
  }

  @Get('nonce')
  async getNonce() {
    return this.justaname.signIn.generateNonce()
  }

  @Post('signin')
  async signInChallenge(
    @Body() body: AuthSigninApiRequest,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const { data: message, subname } = await this.justaname.signIn.signIn(body.message, body.signature)

    if (!message) {
      res.status(500).json({ message: 'No message returned.' });
      return;
    }

    if (!message.expirationTime) {
      res.status(500).json({ message: 'No expirationTime returned.' });
      return;
    }


    const token = this.jwtService.sign({ subname, address: message.address }, {
      expiresIn: moment(message.expirationTime).diff(moment(), 'seconds')
    });


    res.cookie('justanidtoken', token, { httpOnly: true, secure: true, sameSite: 'none' });

    return res.status(200).send({ subname, address: message.address });

  }

  @UseGuards(JwtGuard)
  @Get('session')
  async getSession(
    @Req() req: Request & { user: Siwj },
    @Res() res: Response
  ) {
    if (!req.user) {
      res.status(401).json({ message: 'You have to first sign_in' });
      return;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send({ subname: req.user?.subname, address: req.user?.address });
  }

  @UseGuards(JwtGuard)
  @Get('signout')
  async signOut(
    @Req() req: Request,
    @Res() res: Response
  ) {
    res.clearCookie('justanidtoken');
    res.status(200).send({ message: 'You have been signed out' });
  }
}
