export type ErrorType = 'invalid-id' | 'bad-url' | 'missing-data' | 'unknown';

export interface ErrorPageConfig {
  type: ErrorType;
  title: string;
  message: string;
}
