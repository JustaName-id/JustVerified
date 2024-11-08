export const identifierMatcher = /^(.*:)?(.*\..+)$/
export const nullAddress = '0x0000000000000000000000000000000000000000'
export const DEFAULT_JSON_RPC = 'http://127.0.0.1:8545/'

export const knownInfuraNetworks: Record<string, string> = {
  mainnet: '0x1',
  goerli: '0x5',
  sepolia: '0xaa36a7',
}

export const knownNetworks: Record<string, string> = {
  ...knownInfuraNetworks,
  rsk: '0x1e',
  'rsk:testnet': '0x1f',
  artis_t1: '0x03c401',
  artis_s1: '0x03c301',
  matic: '0x89',
  maticmum: '0x13881',
}

export enum Errors {
  /**
   * The resolver has failed to construct the DID document.
   * This can be caused by a network issue, a wrong registry address or malformed logs while parsing the registry
   * history. Please inspect the `DIDResolutionMetadata.message` to debug further.
   */
  notFound = 'notFound',

  /**
   * The resolver does not know how to resolve the given DID. Most likely it is not a `did:ens`.
   */
  invalidDid = 'invalidDid',

  /**
   * The resolver is misconfigured or is being asked to resolve a DID anchored on an unknown network
   */
  unknownNetwork = 'unknownNetwork',

  /**
   * The resolver is being asked to resolve a DID anchored on a network without a known ENS resolver.
   */
  unknownEnsResolver = 'unknownEnsResolver',
}

export function isDefined<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg && typeof arg !== 'undefined'
}
