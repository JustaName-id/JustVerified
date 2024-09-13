import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { TwitterCredential } from '../../../../../domain/credentials/twitter.credential';
import { Inject } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { HttpService } from '@nestjs/axios';
import { CREDENTIAL_CREATOR, ICredentialCreator } from '../../../creator/icredential.creator';
import { TIME_GENERATOR, TimeGenerator } from '../../../../time.generator';
import { TwitterCallback } from './callback/twitter.callback';
import { TwitterToken } from './token/twitter.token';
import { TwitterAuth } from './auth/twitter.auth';
import { VerifiedEthereumEip712Signature2021 } from '../../../../../domain/entities/eip712';


export class TwitterSubjectResolver extends AbstractSubjectResolver<TwitterCallback ,TwitterCredential> {

  // needs to be changed
  codeVerifier = "1234567890123456789012345678901234567890123456789012345678901234";

  twitterAuthUrl = "https://twitter.com/i/oauth2/authorize";
  twitterTokenUrl = "https://api.twitter.com/2/oauth2/token";
  twitterUserUrl = "https://api.twitter.com/2/users/me";

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
    return "twitter";
  }

  getCallbackParameters(): string[] {
    return ['code']
  }

  getType(): string[] {
    return ['VerifiableTwitterAccount']
  }

  getContext(): string[] {
    return []
  }

  getAuthUrl(): string {
    const state = Math.random().toString(36).substring(7); // Generate a random state
    const clientId = this.environmentGetter.getTwitterClientId();
    return `${this.twitterAuthUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      this.getCallbackUrl()
    )}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge=${this.codeVerifier}&code_challenge_method=plain`;
  }

  async callbackSuccessful(params: TwitterCallback): Promise<VerifiedEthereumEip712Signature2021> {

    const response = await this.httpService.axiosRef.post<TwitterToken>(
      this.twitterTokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri: this.getCallbackUrl(),
        client_id: this.environmentGetter.getTwitterClientId(),
        code_verifier: this.codeVerifier,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.environmentGetter.getTwitterClientId()}:${this.environmentGetter.getTwitterClientSecret()}`
          ).toString("base64")}`,
        },
      }
    );

    const accessToken = response.data.access_token;

    // Fetch the authenticated user's data
    const userResponse = await this.httpService.axiosRef.get<TwitterAuth>(
        this.twitterUserUrl,
      {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const verifiedCredential = await this.generateCredentialSubject({
      username: userResponse.data.data.username,
    });

    return verifiedCredential;
  }
}
