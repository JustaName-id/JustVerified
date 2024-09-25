import { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { ChainId } from '@justaname.id/sdk';
import { Button } from '@justaname.id/react-ui'
import { SIWENSProvider, SIWENSProviderConfig, useSignInWithEns, useMApp } from '@justaname.id/react-signin';
import { JustVerifiedProvider, useJustVerified } from '../lib/providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

const JustaNameConfig: SIWENSProviderConfig = {
  config: {
    chainId: parseInt(import.meta.env.STORYBOOK_APP_CHAIN_ID) as ChainId,
    origin: import.meta.env.STORYBOOK_APP_ORIGIN,
    domain: import.meta.env.STORYBOOK_APP_DOMAIN,
    signIn:{
      ttl: 1000 * 60 * 60 * 24
    },
  },
  backendUrl: import.meta.env.STORYBOOK_APP_BACKEND_URL,
  providerUrl: import.meta.env.STORYBOOK_APP_PROVIDER_URL,
  ensDomain: import.meta.env.STORYBOOK_APP_ENS_DOMAIN,
  openOnWalletConnect: true,
  allowedEns:'all',
}

const Session = () => {
  const { connectedEns, handleOpenSignInDialog, signOut} = useSignInWithEns()
  const { configuredCredentials, configuredCredentialsRecords } = useJustVerified()

  return (
    <div>
      <h1>Subname Session</h1>
      {
        !connectedEns && <button onClick={() => handleOpenSignInDialog(true)}>Sign In</button>
      }
      {
        connectedEns && <button onClick={signOut} >Sign Out</button>
      }
      <h2>Connected ENS</h2>
      <pre>{JSON.stringify(connectedEns, null, 2)}</pre>

      <h2>Configured Credentials</h2>
      <pre>{JSON.stringify(configuredCredentials, null, 2)}</pre>

      <h2>Configured Credentials Records</h2>
      <pre>{JSON.stringify(configuredCredentialsRecords, null, 2)}</pre>
    </div>
  )
}

export const Example = () => {

  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: import.meta.env.STORYBOOK_APP_CHAIN_ID === "1" ? [mainnet] : [sepolia],
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SIWENSProvider config={JustaNameConfig}>
            <JustVerifiedProvider credentials={["discord","twitter", "github"]}>
              <ConnectButton />
              <Session />
            </JustVerifiedProvider>
          </SIWENSProvider>
        </RainbowKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const meta: Meta<typeof Example> = {
  component: Example,
  title: 'Connect/MAppDialog',
};

export default meta;
// @ts-ignore
type Story = StoryObj<typeof Example>
