import {Injectable} from "@nestjs/common";
import { ISocialCredentialResolver} from "./isocial.credential.resolver";
import {GithubSocialResolver} from "./social-resolver/github.social.resolver";
import {AbstractSocialResolver} from "./social-resolver/abstract.social.resolver";
import { DiscordSocialResolver } from './social-resolver/discord.social.resolver';
import { TelegramSocialResolver } from './social-resolver/telegram.social.resolver';
import { TwitterSocialResolver } from './social-resolver/twitter.social.resolver';

@Injectable()
export class SocialCredentialResolver implements ISocialCredentialResolver {

  constructor(
    private readonly githubSubjectResolver: GithubSocialResolver,
    private readonly discordSubjectResolver: DiscordSocialResolver,
    private readonly telegramSubjectResolver: TelegramSocialResolver,
    private readonly twitterSubjectResolver: TwitterSocialResolver
  ) {}

  getSocialResolvers(): AbstractSocialResolver[] {
    return [
      this.githubSubjectResolver,
      this.discordSubjectResolver,
      this.telegramSubjectResolver,
      this.twitterSubjectResolver
    ];
  }
}
