import { OpenPassportVerifier, OpenPassportDynamicAttestation } from '@openpassport/core';
import { OpenPassportQRcode } from '@openpassport/qrcode';

export function App() {
  const scope = "JustaName | Proof Of Humanity";
  const openPassportVerifier = new OpenPassportVerifier('prove_offchain', scope).allowMockPassports();
  const address = new URLSearchParams(window.location.search).get('address');

  if (!address) {
    return <h2>Please provide an address parameter in the URL to continue</h2>;
  }

  return (
    <OpenPassportQRcode
      appName={scope}
      userId={address}
      userIdType={'hex'}
      openPassportVerifier={openPassportVerifier}
      onSuccess={async (attestation) => {
        console.log(attestation);
      }}
    />
  );
}

export default App;
