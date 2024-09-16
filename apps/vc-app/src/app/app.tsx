import { SIWJProvider, SIWJProviderConfig, useSignInWithJustaName } from '@justaname.id/react-signin';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ChainId } from '@justaname.id/sdk';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { mainnet, sepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import axios from 'axios';
const queryClient = new QueryClient();

const JustaNameConfig: SIWJProviderConfig = {
  config: {
    chainId: parseInt(import.meta.env.VITE_APP_CHAIN_ID) as ChainId,
    origin: import.meta.env.VITE_APP_ORIGIN,
    domain: import.meta.env.VITE_APP_DOMAIN,
    signIn:{
      ttl: 1000 * 60 * 60 * 24
    },
  },
  backendUrl: import.meta.env.VITE_APP_BACKEND_URL,
  providerUrl: import.meta.env.VITE_APP_PROVIDER_URL,
  ensDomain: import.meta.env.VITE_APP_ENS_DOMAIN,
  routes:{
    signinRoute: '/auth/signin',
    signinNonceRoute: '/auth/nonce',
    sessionRoute: '/auth/session',
    signoutRoute: '/auth/signout',
    addSubnameRoute: '/auth/add-subname',
    revokeSubnameRoute: '/auth/revoke-subname',
  },
  openOnWalletConnect: true,
  allowedSubnames:'all',
}


const Session = () => {
  const { session, handleDialog, signOut, refreshSubnameSession} = useSignInWithJustaName()

  async function initiateLogin(auth: "twitter" | "github" | "telegram" | "discord") {
    await refreshSubnameSession();
    const eventSource = new EventSource(import.meta.env.VITE_APP_BACKEND_URL + '/credentials/'+ auth, {withCredentials: true});

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      } else if (data.result) {
        console.log('Authentication result:', data.result);
        eventSource.close();
      } else if (data.error) {
        console.error('Authentication error:', data.error);
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
  }


  return (
    <div>
      <h1>Subname Session</h1>
      {
        !session && <button onClick={() => handleDialog(true)}>Sign In</button>
      }
      {
        session && <button onClick={signOut}>Sign Out</button>
      }
      <pre>{JSON.stringify(session, null, 2)}</pre>

      <button
        onClick={() => initiateLogin('github')}
      >Github</button>
      <button
        onClick={() => initiateLogin('twitter')}
      >Twitter</button>
      <button
        onClick={() => initiateLogin('telegram')}
      >Telegram</button>
      <button
        onClick={() => initiateLogin('discord')}
      >Discord</button>
    </div>
  )
}

export const App = () => {

  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: import.meta.env.VITE_APP_CHAIN_ID === "1" ? [mainnet] : [sepolia],
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SIWJProvider config={JustaNameConfig}>
            <ConnectButton />
            <Session />
          </SIWJProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


export default App;
