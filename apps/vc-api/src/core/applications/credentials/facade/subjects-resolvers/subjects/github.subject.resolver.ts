import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { GithubCredential } from '../../../../../domain/credentials/github.credential';
import { Inject } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { HttpService } from '@nestjs/axios';
import { CREDENTIAL_CREATOR, ICredentialCreator } from '../../../creator/icredential.creator';
import { TIME_GENERATOR, TimeGenerator } from '../../../../time.generator';
import { GithubCallback } from './callback/github.callback';
import { GithubToken } from './token/github.token';
import { GithubAuth } from './auth/github.auth';

export class GithubSubjectResolver extends AbstractSubjectResolver<GithubCallback ,GithubCredential> {
  githubAuthUrl = "https://github.com/login/oauth/authorize";
  githubTokenUrl = "https://github.com/login/oauth/access_token";
  githubUserUrl = "https://api.github.com/user";

  constructor(
    @Inject(ENVIRONMENT_GETTER)
    readonly environmentGetter: IEnvironmentGetter,
    @Inject(CREDENTIAL_CREATOR)
    readonly credentialCreator: ICredentialCreator,
    @Inject(TIME_GENERATOR)
    private readonly timeGenerator: TimeGenerator,

    private readonly httpService: HttpService
  ) {
    super(
      credentialCreator,
      timeGenerator,
      environmentGetter
    );
  }

  getCredentialName(): string {
    return "github";
  }

  getCallbackParameters(): string[] {
    return ['code']
  }

  getType(): string[] {
    return ['VerifiableGithubAccount']
  }

  getContext(): string[] {
    return []
  }

  getAuthUrl(): string {
    const state = Math.random().toString(36).substring(7); // Generate a random state
    const clientId = this.environmentGetter.getGithubClientId();
    const redirectUri = `${this.environmentGetter.getApiDomain()}/auth/github/callback`;
    const scope = 'read:user';
    return `${this.githubAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
  }

  async callbackSuccessful(params: GithubCallback): Promise<void> {
    const response = await this.httpService.axiosRef.post<GithubToken>(
      this.githubTokenUrl,
      {
        client_id: this.environmentGetter.getGithubClientId(),
        client_secret: this.environmentGetter.getGithubClientSecret(),
        code: params.code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = response.data.access_token;

    const userResponse =  await this.httpService.axiosRef.get<GithubAuth>(
      this.githubUserUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });


    const verifiedCredential = await this.generateCredentialSubject({
      username: userResponse.data.login,
    });

    console.log(verifiedCredential);
  }
}
