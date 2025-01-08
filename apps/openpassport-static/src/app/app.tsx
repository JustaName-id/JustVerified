import axios from 'axios';
import { OpenPassportQRcode } from '@openpassport/qrcode';
import { OpenPassportAttestation, OpenPassportVerifier } from '@openpassport/core';

export function App() {
  const address = new URLSearchParams(window.location.search).get('address');
  const state = new URLSearchParams(window.location.search).get('state');
  
  const environment = import.meta.env.VITE_APP_ENVIRONMENT;
  const scope = import.meta.env.VITE_APP_OPENPASSPORT_SCOPE;
  let openPassportVerifier = new OpenPassportVerifier('prove_offchain', scope);

  if (environment === 'development' || environment === 'staging') {
    openPassportVerifier = openPassportVerifier.allowMockPassports();
  }

  const callback = async (attestation: OpenPassportAttestation) => {
    try {
      const encodedAttestation = btoa(JSON.stringify(attestation));

      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_DOMAIN}/credentials/socials/openpassport/callback`, 
        {
          params: {
            code: encodedAttestation,
            state: state,
          },
        }
      );

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response.data;

      const scripts = tempDiv.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        eval(script.textContent || '');
      }
    } catch (error) {
      console.error('Error in callback:', error);
    }
  }

  if (!address || !state) {
    return <h2>Please provide an address parameter in the URL to continue</h2>;
  }

  return (
    <OpenPassportQRcode
      appName={scope}
      userId={address.replace("0x", "")}
      userIdType={"hex"}
      openPassportVerifier={openPassportVerifier}
      onSuccess={async (attestation) => {
        await callback(attestation);
      }}
    />
  );
}

export default App;
