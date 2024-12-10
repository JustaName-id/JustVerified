import { OpenPassportVerifier } from '@openpassport/core';
import { OpenPassportQRcode } from '@openpassport/qrcode';

export function App() {
  const scope = "JustaName";
  // TODO: remove mock passports
  const openPassportVerifier = new OpenPassportVerifier('prove_offchain', scope).allowMockPassports();
  const address = new URLSearchParams(window.location.search).get('address');
  const state = new URLSearchParams(window.location.search).get('state');

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
        console.log(attestation);
      }}
    />
  );
}

export default App;
