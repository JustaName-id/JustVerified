import { BaseSocialCallback } from './base.social.callback';

export class TelegramCallback extends BaseSocialCallback {
  id: string;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: string;
  hash: string;
}
