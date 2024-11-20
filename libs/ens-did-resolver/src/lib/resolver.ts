import { EnsResolver } from 'ethers'
import { DIDDocument, DIDResolutionResult, DIDResolver, ParsedDID, Service, VerificationMethod } from 'did-resolver'
import { ConfigurationOptions, configureResolverWithNetworks, Provider } from './configuration';
import { Errors, identifierMatcher, isDefined } from './helpers'

export function getResolver(config?: ConfigurationOptions): Record<string, DIDResolver> {
  // Define the cache Map at the module level
  const didCache = new Map<string, DIDResolutionResult>();

  async function resolve(did: string, parsed: ParsedDID): Promise<DIDResolutionResult> {
    // **Check if the DID is in the cache**
    if (didCache.has(did)) {
      return didCache.get(did)!;
    }

    // **Proceed with the existing resolution logic**

    const networks = configureResolverWithNetworks(config);
    // Check if identifier(parsed.id) contains a network code
    const fullId = parsed.id.match(identifierMatcher);
    if (!fullId) {
      const errorResult: DIDResolutionResult = {
        didResolutionMetadata: {
          error: Errors.invalidDid,
          message: `Not a valid did:ens: ${parsed.id}`,
        },
        didDocumentMetadata: {},
        didDocument: null,
      };
      // **Cache the error result**
      didCache.set(did, errorResult);
      return errorResult;
    }

    const ensName = fullId[2];
    const networkCode = typeof fullId[1] === 'string' ? fullId[1].slice(0, -1) : '';

    // Get provider for that network or the mainnet provider if none other is given
    const provider: Provider = networks[networkCode];
    if (!provider || typeof provider === 'undefined') {
      const errorResult: DIDResolutionResult = {
        didResolutionMetadata: {
          error: Errors.unknownNetwork,
          message: `This resolver is not configured for the ${networkCode} network required by ${
            parsed.id
          }. Networks: ${JSON.stringify(Object.keys(networks))}`,
        },
        didDocumentMetadata: {},
        didDocument: null,
      };
      // **Cache the error result**
      didCache.set(did, errorResult);
      return errorResult;
    }

    const ensResolver: EnsResolver | null = await provider.getResolver(ensName);
    if (!ensResolver) {
      const errorResult: DIDResolutionResult = {
        didResolutionMetadata: {
          error: Errors.unknownEnsResolver,
          message: `This network (${networkCode}), required by ${parsed.id}, does not have a known ENS resolver`,
        },
        didDocumentMetadata: {},
        didDocument: null,
      };
      // **Cache the error result**
      didCache.set(did, errorResult);
      return errorResult;
    }

    let err: string | null = null;
    let address: string | null = null;
    try {
      address = await ensResolver.getAddress();
    } catch (error) {
      err = `resolver_error: Cannot resolve ENS name: ${error}`;
    }

    const didDocumentMetadata = {};
    let didDocument: DIDDocument | null = null;

    if (address) {
      const chainId = (await provider.getNetwork()).chainId;
      const blockchainAccountId = `${address}@eip155:${chainId}`;
      const postfix = address;

      // Setup default DID document
      didDocument = {
        id: did,
        service: [
          {
            id: `${did}#Web3PublicProfile-${postfix}`,
            type: 'Web3PublicProfile',
            serviceEndpoint: ensName,
          },
        ],
        verificationMethod: [
          {
            id: `${did}#${postfix}`,
            type: 'EcdsaSecp256k1RecoveryMethod2020',
            controller: did,
            blockchainAccountId,
          },
        ],
        authentication: [`${did}#${postfix}`],
        capabilityDelegation: [`${did}#${postfix}`],
        capabilityInvocation: [`${did}#${postfix}`],
        assertionMethod: [`${did}#${postfix}`],
      };
    }

    // **Your existing logic for fetching and adding services and verification methods**

    // Fetch services and verification methods
    const getEnsRecord = async <T>(ensResolver: EnsResolver, name: string): Promise<T | null> => {
      let parsedEntry: T | null = null;
      const entry = await ensResolver.getText(name);
      if (entry) {
        try {
          parsedEntry = JSON.parse(unescape(entry));
        } catch (e) {
          return null;
        }
      }
      return parsedEntry;
    };

    const filterValidVerificationMethods = (
      did: string,
      current: (string | VerificationMethod)[],
      all: VerificationMethod[]
    ): (string | VerificationMethod)[] => {
      const methodLinks = (current.filter((entry) => typeof entry === 'string') as string[])
        .map((entry) => (entry.startsWith('#') ? `${did}${entry}` : entry))
        .filter((entry) => all?.some((b) => b.id === entry));

      const fullMethods = (
        current.filter(
          (entry) =>
            entry != null &&
            typeof entry === 'object' &&
            Object.keys(entry).includes('id') &&
            Object.keys(entry).includes('type') &&
            Object.keys(entry).some((k) => k.startsWith('publicKey'))
        ) as VerificationMethod[]
      ).map((entry: VerificationMethod) => {
        entry.controller = entry.controller || did;
        if (entry.id.startsWith('#')) {
          entry.id = `${did}${entry.id}`;
        }
        return entry;
      });
      return [...methodLinks, ...fullMethods];
    };

    const services = (await getEnsRecord<Service[]>(ensResolver, 'org.w3c.did.service')) || [];
    if (services && didDocument) {
      didDocument.service = [...(didDocument.service || []), ...services].filter(isDefined);
    }

    const verificationMethods =
      (await getEnsRecord<VerificationMethod[]>(ensResolver, 'org.w3c.did.verificationMethod')) || [];

    if (verificationMethods && didDocument) {
      verificationMethods.map((method) => {
        if (method.id.startsWith('#')) {
          method.id = `${did}${method.id}`;
        }
        method.controller = method.controller || did;
        return method;
      });
      didDocument.verificationMethod = [
        ...(didDocument.verificationMethod || []),
        ...verificationMethods,
      ].filter(isDefined);
    }

    const relationships = [
      'keyAgreement',
      'assertionMethod',
      'authentication',
      'capabilityInvocation',
      'capabilityDelegation',
    ];
    await relationships.reduce(async (memo, relationship) => {
      await memo;
      try {
        const verificationMethod =
          (await getEnsRecord<(string | VerificationMethod)[]>(
            ensResolver,
            `org.w3c.did.${relationship}`
          )) || [];
        if (verificationMethod && didDocument) {
          // @ts-ignore
          didDocument[relationship] = [
            // @ts-ignore
            ...(didDocument[relationship] || []),
            ...filterValidVerificationMethods(did, verificationMethod, verificationMethods),
          ];
        }
      } catch (e) {
        // No operation
      }
    }, Promise.resolve());

    const contentType =
      typeof didDocument?.['@context'] !== 'undefined' ? 'application/did+ld+json' : 'application/did+json';

    // **Construct the DID Resolution Result**
    let didResolutionResult: DIDResolutionResult;
    if (err) {
      didResolutionResult = {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: {
          error: Errors.notFound,
          message: err,
        },
      };
    } else {
      didResolutionResult = {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: { contentType },
      };
    }

    // **Store the result in the cache before returning**
    didCache.set(did, didResolutionResult);

    // **Return the result**
    return didResolutionResult;
  }

  return { ens: resolve };
}
