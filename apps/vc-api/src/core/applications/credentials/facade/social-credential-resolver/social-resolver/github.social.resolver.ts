import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AbstractSocialResolver } from './abstract.social.resolver';
import { GithubCredential } from '../../../../../domain/credentials/github.credential';
import { GithubCallback } from './callback/github.callback';
import { GithubToken } from './token/github.token';
import { GithubAuth } from './auth/github.auth';
import { VerifiableEthereumEip712Signature2021 } from '../../../../../domain/entities/ethereumEip712Signature';

export class GithubSocialResolver extends AbstractSocialResolver<
  GithubCallback,
  GithubCredential
> {
  githubAuthUrl = 'https://github.com/login/oauth/authorize';
  githubTokenUrl = 'https://github.com/login/oauth/access_token';
  githubUserUrl = 'https://api.github.com/user';

  getCredentialName(): string {
    return 'github';
  }

  getKey(): string {
    return 'com.github';
  }

  getType(): string[] {
    return ['VerifiableGithubAccount'];
  }

  getAuthUrl({ens, authId}): string {
    const stateObject = { ens, authId };
    const encryptedState = this.cryptoEncryption.encrypt(JSON.stringify(stateObject));
    const clientId = this.environmentGetter.getGithubClientId();
    const scope = 'read:user';
    return `${this.githubAuthUrl}?client_id=${clientId}&redirect_uri=${this.getCallbackUrl()}&state=${encryptedState}&scope=${scope}`;
  }

  async extractCredentialSubject(
    params: GithubCallback
  ): Promise<GithubCredential> {
    const response = await this.httpService.axiosRef.post<GithubToken>(
      this.githubTokenUrl,
      {
        client_id: this.environmentGetter.getGithubClientId(),
        client_secret: this.environmentGetter.getGithubClientSecret(),
        code: params.code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = response.data.access_token;

    const userResponse = await this.httpService.axiosRef.get<GithubAuth>(
      this.githubUserUrl,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    return {
      username: userResponse.data.login,
    }
  }
}
