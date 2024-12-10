import axios from 'axios';
import { OpenPassportVerifier } from '@openpassport/core';
import { OpenPassportQRcode } from '@openpassport/qrcode';

export function App() {
  const scope = "JustaName";
  // TODO: remove mock passports
  const openPassportVerifier = new OpenPassportVerifier('prove_offchain', scope).allowMockPassports();
  const address = new URLSearchParams(window.location.search).get('address');
  const state = new URLSearchParams(window.location.search).get('state');

  const callback = async (encodedAttestation: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_DOMAIN}/credentials/socials/openpassport/callback`, 
        {
          params: {
            code: encodedAttestation,
            state: state,
          },
        }
      );
      console.log('Callback response:', response.data);
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
        const encodedAttestation = btoa(JSON.stringify(attestation));
        console.log(attestation);
        console.log(encodedAttestation);

        await callback(encodedAttestation);
      }}
    />
  );
}

export default App;
