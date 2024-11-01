import {useEffect} from "react";

export function App() {
  const telegramBotUsername = import.meta.env.VITE_APP_TELEGRAM_BOT_USERNAME;
  const apiDomain = import.meta.env.VITE_APP_API_DOMAIN;
  const state = new URLSearchParams(window.location.search).get('state');
  const dataAuthUrl = `${apiDomain}/credentials/socials/telegram/callback?state=${state}`;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?15";
    script.async = true;
    script.setAttribute('data-telegram-login', telegramBotUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', dataAuthUrl);
    script.setAttribute('data-request-access', 'write');

    document.getElementById('telegram-widget-container')?.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      document.getElementById('telegram-widget-container')?.removeChild(script);
    };
  }, [telegramBotUsername, dataAuthUrl]);

  return <div id="telegram-widget-container"></div>;
}
export default App;
