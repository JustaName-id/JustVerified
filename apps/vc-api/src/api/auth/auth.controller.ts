import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthSigninApiRequest } from './requests/auth.signin.api.request';
import { Response, Request} from 'express';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';
import { JwtGuard } from '../../guards/jwt.guard';
import { ENS_MANAGER_SERVICE, IEnsManagerService } from '../../core/applications/ens-manager/iens-manager.service';
import { ChainId } from '../../core/domain/entities/environment';
import {JwtNonceGuard} from "../../guards/jwt-nonce.guard";

type Siwens = { address: string, ens: string, chainId: ChainId };

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(ENS_MANAGER_SERVICE)
    private readonly ensManagerService: IEnsManagerService,
    private readonly jwtService: JwtService
  ) {}

  @Get('nonce')
  async getNonce(
    @Res() res: Response,
    @Req() req: Request
  ) {
    const nonce = this.ensManagerService.generateNonce()
    const token = this.jwtService.sign({ nonce }, {
      expiresIn: 3600
    });
    res.cookie('justverifiednonce', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).send( nonce );
  }

  @UseGuards(JwtNonceGuard)
  @Post('signin')
  async signInChallenge(
    @Body() body: AuthSigninApiRequest,
    @Res() res: Response,
    @Req() req: Request & { nonce: { nonce: string  } }
  ) {
    res.clearCookie('justverifiednonce', { httpOnly: true, secure: true, sameSite: 'none' });
    try {
      const {address, ens, chainId} = await this.ensManagerService.signIn({
        message: body.message,
        signature: body.signature,
        nonce: req.nonce.nonce,
      })

      const token = this.jwtService.sign({ens, address, chainId}, {
        expiresIn: 3600
      });

      res.cookie('justverifiedtoken', token, {httpOnly: true, secure: true, sameSite: 'none'});

      return res.status(200).send({ens, address, chainId});
    }catch (e) {
      res.status(422).send({message: e.message});
    }

  }

  @UseGuards(JwtGuard)
  @Get('current')
  async getSession(
    @Req() req: Request & { user: Siwens },
    @Res() res: Response
  ) {
    if (!req.user) {
      res.status(401).json({ message: 'You have to first sign_in' });
      return;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send({ ens: req.user?.ens, address: req.user?.address, chainId: req.user?.chainId });
  }

  @UseGuards(JwtGuard)
  @Post('signout')
  async signOut(
    @Req() req: Request,
    @Res() res: Response
  ) {
    res.clearCookie('justverifiedtoken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('justverifiednonce', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).send({ message: 'You have been signed out' });
  }
}
