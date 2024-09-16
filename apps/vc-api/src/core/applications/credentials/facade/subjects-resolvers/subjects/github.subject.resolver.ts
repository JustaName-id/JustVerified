import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { GithubCredential } from '../../../../../domain/credentials/github.credential';
import { GithubCallback } from './callback/github.callback';
import { GithubToken } from './token/github.token';
import { GithubAuth } from './auth/github.auth';
import { VerifiedEthereumEip712Signature2021 } from '../../../../../domain/entities/eip712';

export class GithubSubjectResolver extends AbstractSubjectResolver<
  GithubCallback,
  GithubCredential
> {
  githubAuthUrl = 'https://github.com/login/oauth/authorize';
  githubTokenUrl = 'https://github.com/login/oauth/access_token';
  githubUserUrl = 'https://api.github.com/user';

  getCredentialName(): string {
    return 'github';
  }

  getCallbackParameters(): string[] {
    return ['code'];
  }

  getType(): string[] {
    return ['VerifiableGithubAccount'];
  }

  getContext(): string[] {
    return [];
  }

  getAuthUrl(subname: string): string {
    const clientId = this.environmentGetter.getGithubClientId();
    const scope = 'read:user';
    return `${this.githubAuthUrl}?client_id=${clientId}&redirect_uri=${this.getCallbackUrl()}&state=${subname}&scope=${scope}`;
  }

  async callbackSuccessful(
    params: GithubCallback, ens: string
  ): Promise<VerifiedEthereumEip712Signature2021> {
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

    const verifiedCredential = await this.generateCredentialSubject({
      username: userResponse.data.login,
    }, ens);

    return verifiedCredential;
  }
}
