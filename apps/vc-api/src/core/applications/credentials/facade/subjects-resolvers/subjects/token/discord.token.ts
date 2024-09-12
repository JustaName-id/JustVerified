export class DiscordToken {
  'access_token': string;
  'token_type': string;
  'scope': 'identify' | 'email';
  expires_in: number;
  refresh_token: string;
}
