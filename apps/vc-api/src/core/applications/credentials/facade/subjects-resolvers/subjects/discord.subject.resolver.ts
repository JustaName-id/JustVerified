import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { DiscordCredential } from '../../../../../domain/credentials/discord.credential';
import { Inject } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { HttpService } from '@nestjs/axios';
import { CREDENTIAL_CREATOR, ICredentialCreator } from '../../../creator/icredential.creator';
import { TIME_GENERATOR, TimeGenerator } from '../../../../time.generator';
import { DiscordCallback } from './callback/discord.callback';
import { DiscordToken } from './token/discord.token';
import { DiscordAuth } from './auth/discord.auth';

export class DiscordSubjectResolver extends AbstractSubjectResolver<DiscordCallback ,DiscordCredential> {

  discordAuthUrl = "https://discord.com/api/oauth2/authorize";
  discordTokenUrl = "https://discord.com/api/oauth2/token";
  discordUserUrl = "https://discord.com/api/users/@me";

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
    return "discord";
  }

  getCallbackParameters(): string[] {
    return ['code']
  }

  getType(): string[] {
    return ['VerifiableDiscordAccount']
  }

  getContext(): string[] {
    return []
  }

  getAuthUrl(): string {
    const state = Math.random().toString(36).substring(7); // Generate a random state
    const clientId = this.environmentGetter.getDiscordClientId();
    return `${this.discordAuthUrl}?response_type=code&client_id=${clientId}&scope=identify&redirect_uri=${
    this.getCallbackUrl()}&state=${state}`;
  }

  async callbackSuccessful(params: DiscordCallback): Promise<void> {
    const response = await this.httpService.axiosRef.post<DiscordToken>(
      this.discordTokenUrl,
      new URLSearchParams({
        client_id: this.environmentGetter.getDiscordClientId(),
        client_secret: this.environmentGetter.getDiscordClientSecret(),
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri: `${this.environmentGetter.getApiDomain()}/auth/discord/callback`,
        scope: "identify",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;

    // Fetch the authenticated user's data
    const userResponse = await this.httpService.axiosRef.get<DiscordAuth>(
      this.discordUserUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const verifiedCredential = await this.generateCredentialSubject({
      username: userResponse.data.global_name,
    });
  }
}
