export class RecordsFetchingException extends Error {
  constructor(message: string) {
    super(message);
  }

  static forSubnamesWithProvider(subnames: string[], providerUrl: string) {
    const errorMessage = `Failed to fetch records for: ${subnames.join(
      ', '
    )}, with provider: ${providerUrl}`;
    return new RecordsFetchingException(errorMessage);
  }
}
