import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { AbstractSocialResolver } from './abstract.social.resolver';
import { DiscordCredential } from '../../../../../domain/credentials/discord.credential';
import { DiscordCallback } from './callback/discord.callback';
import { DiscordToken } from './token/discord.token';
import { DiscordAuth } from './auth/discord.auth';
import { VerifiableEthereumEip712Signature2021 } from '../../../../../domain/entities/ethereumEip712Signature';
import {GetAuthUrlRequest} from "./requests/get-auth-url.request";

export class DiscordSocialResolver extends AbstractSocialResolver<
  DiscordCallback,
  DiscordCredential
> {
  discordAuthUrl = 'https://discord.com/api/oauth2/authorize';
  discordTokenUrl = 'https://discord.com/api/oauth2/token';
  discordUserUrl = 'https://discord.com/api/users/@me';

  getCredentialName(): string {
    return 'discord';
  }
  getKey(): string {
    return 'com.discord';
  }

  getType(): string[] {
    return ['VerifiableDiscordAccount'];
  }

  getAuthUrl(authUrlRequest:GetAuthUrlRequest): string {
    const encryptedState = this.encryptState(authUrlRequest);
    const clientId = this.environmentGetter.getDiscordClientId();
    return `${
      this.discordAuthUrl
    }?response_type=code&client_id=${clientId}&scope=identify&redirect_uri=${this.getCallbackUrl()}&state=${encryptedState}`;
  }

  async extractCredentialSubject(
    params: DiscordCallback
  ): Promise<DiscordCredential> {
    const response = await this.httpService.axiosRef.post<DiscordToken>(
      this.discordTokenUrl,
      new URLSearchParams({
        client_id: this.environmentGetter.getDiscordClientId(),
        client_secret: this.environmentGetter.getDiscordClientSecret(),
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: `${
          this.getCallbackUrl()
        }`,
        scope: 'identify',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;

    const userResponse = await this.httpService.axiosRef.get<DiscordAuth>(
      this.discordUserUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      username: userResponse.data.username,
    }
  }
}
