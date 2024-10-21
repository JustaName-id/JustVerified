import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtNonceGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const nonce = this.extractTokenFromHeader(request);
    if (!nonce) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(nonce, {
        secret: process.env.JWT_SECRET,
      });
      request['nonce'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.cookie?.split(';').find((cookie) => cookie.trim().startsWith('justverifiednonce='))?.split('=')[1];
  }
}
