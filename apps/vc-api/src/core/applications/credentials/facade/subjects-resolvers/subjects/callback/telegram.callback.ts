import { AllCallback } from './all.callback';

export class TelegramCallback extends AllCallback {
  id: string;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: string;
  hash: string;
}
