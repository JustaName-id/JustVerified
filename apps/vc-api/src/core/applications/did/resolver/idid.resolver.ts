
export const DID_RESOLVER = 'DID_RESOLVER'

export interface IDIDResolver {
   getEnsDid(ens: string): Promise<string>
}
