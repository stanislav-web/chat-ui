export interface IErrorState {
  hasError: boolean;
  error?: string;
  errorInfo?: Error & { componentStack?: any };
}
