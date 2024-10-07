export interface BaseFilterResponse {
    statusCode: number;
    result: {
      data: object | null;
      error: string | null;
    };
  }