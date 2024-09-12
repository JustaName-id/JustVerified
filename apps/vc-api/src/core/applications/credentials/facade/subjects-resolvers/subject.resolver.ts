import {Injectable} from "@nestjs/common";
import {ISubjectResolver} from "./isubject.resolver";
import {GithubSubjectResolver} from "./subjects/github.subject.resolver";
import {AbstractSubjectResolver} from "./subjects/abstract.subject.resolver";
import { DiscordSubjectResolver } from './subjects/discord.subject.resolver';
import { TelegramSubjectResolver } from './subjects/telegram.subject.resolver';
import { TwitterSubjectResolver } from './subjects/twitter.subject.resolver';

@Injectable()
export class SubjectResolver implements ISubjectResolver {

  constructor(
    private readonly githubSubjectResolver: GithubSubjectResolver,
    private readonly discordSubjectResolver: DiscordSubjectResolver,
    private readonly telegramSubjectResolver: TelegramSubjectResolver,
    private readonly twitterSubjectResolver: TwitterSubjectResolver
  ) {
  }

  getSubjectResolvers(): AbstractSubjectResolver[] {
    return [
      this.githubSubjectResolver,
      this.discordSubjectResolver,
      this.telegramSubjectResolver,
      this.twitterSubjectResolver
    ];
  }
}
