import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { DiscordCredential } from '../../../../../domain/credentials/discord.credential';
import { DiscordCallback } from './callback/discord.callback';
import { DiscordToken } from './token/discord.token';
import { DiscordAuth } from './auth/discord.auth';
import { VerifiedEthereumEip712Signature2021 } from '../../../../../domain/entities/eip712';

export class DiscordSubjectResolver extends AbstractSubjectResolver<
  DiscordCallback,
  DiscordCredential
> {
  discordAuthUrl = 'https://discord.com/api/oauth2/authorize';
  discordTokenUrl = 'https://discord.com/api/oauth2/token';
  discordUserUrl = 'https://discord.com/api/users/@me';

  getCredentialName(): string {
    return 'discord';
  }

  getCallbackParameters(): string[] {
    return ['code'];
  }

  getType(): string[] {
    return ['VerifiableDiscordAccount'];
  }

  getContext(): string[] {
    return [];
  }

  getAuthUrl(): string {
    const state = Math.random().toString(36).substring(7); // Generate a random state
    const clientId = this.environmentGetter.getDiscordClientId();
    return `${
      this.discordAuthUrl
    }?response_type=code&client_id=${clientId}&scope=identify&redirect_uri=${this.getCallbackUrl()}&state=${state}`;
  }

  async callbackSuccessful(
    params: DiscordCallback,  ens: string
  ): Promise<VerifiedEthereumEip712Signature2021> {
    const response = await this.httpService.axiosRef.post<DiscordToken>(
      this.discordTokenUrl,
      new URLSearchParams({
        client_id: this.environmentGetter.getDiscordClientId(),
        client_secret: this.environmentGetter.getDiscordClientSecret(),
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: `${this.environmentGetter.getApiDomain()}/auth/discord/callback`,
        scope: 'identify',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;

    // Fetch the authenticated user's data
    const userResponse = await this.httpService.axiosRef.get<DiscordAuth>(
      this.discordUserUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const verifiedCredential = await this.generateCredentialSubject({
      username: userResponse.data.global_name,
    }, ens);

    return verifiedCredential;
  }
}
