/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_TELEGRAM_BOT_USERNAME: string;
  VITE_APP_API_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
