export interface DiscordAuth {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string;
  accent_color: string;
  global_name: string;
  avatar_decoration_data: string;
  banner_color: string;
  clan: string;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
}
