import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { TwitterCredential } from '../../../../../domain/credentials/twitter.credential';
import { TwitterCallback } from './callback/twitter.callback';
import { TwitterToken } from './token/twitter.token';
import { TwitterAuth } from './auth/twitter.auth';
import { VerifiableEthereumEip712Signature2021 } from '../../../../../domain/entities/eip712';

export class TwitterSubjectResolver extends AbstractSubjectResolver<
  TwitterCallback,
  TwitterCredential
> {

  private codeVerifierCache: Map<string, string> = new Map();

  twitterAuthUrl = 'https://twitter.com/i/oauth2/authorize';
  twitterTokenUrl = 'https://api.twitter.com/2/oauth2/token';
  twitterUserUrl = 'https://api.twitter.com/2/users/me';

  getCredentialName(): string {
    return 'twitter';
  }

  getCallbackParameters(): string[] {
    return ['code'];
  }

  getType(): string[] {
    return ['VerifiableTwitterAccount'];
  }

  getContext(): string[] {
    return [];
  }

  getAuthUrl(ens: string, authId: string): string {
    const clientId = this.environmentGetter.getTwitterClientId();
    const stateObject = { ens, authId };
    const encryptedState = this.cryptoEncryption.encrypt(JSON.stringify(stateObject));
    const codeVerifier = this.cryptoEncryption.generateCodeVerifier();
    const codeChallenge = this.cryptoEncryption.generateCodeChallenge(codeVerifier);
    this.codeVerifierCache.set(authId, codeVerifier);

    return `${
      this.twitterAuthUrl
    }?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      this.getCallbackUrl()
    )}&scope=tweet.read%20users.read%20offline.access&state=${encryptedState}&code_challenge=${
      codeChallenge
    }&code_challenge_method=S256`;
  }

  async callbackSuccessful(
    params: TwitterCallback, ens: string
  ): Promise<VerifiableEthereumEip712Signature2021> {
    const encryptedState = params.state;
    const decryptedState = this.cryptoEncryption.decrypt(encryptedState);
    const { authId } = JSON.parse(decryptedState);
    const codeVerifier = this.codeVerifierCache.get(authId);

    const response = await this.httpService.axiosRef.post<TwitterToken>(
      this.twitterTokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: this.getCallbackUrl(),
        client_id: this.environmentGetter.getTwitterClientId(),
        code_verifier: codeVerifier,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${this.environmentGetter.getTwitterClientId()}:${this.environmentGetter.getTwitterClientSecret()}`
          ).toString('base64')}`,
        },
      }
    );

    this.codeVerifierCache.delete(authId);

    const accessToken = response.data.access_token;

    // Fetch the authenticated user's data
    const userResponse = await this.httpService.axiosRef.get<TwitterAuth>(
      this.twitterUserUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const verifiedCredential = await this.generateCredentialSubject({
      username: userResponse.data.data.username,
    }, ens);

    return verifiedCredential;
  }
}
