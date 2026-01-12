import type React from 'react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/wrappers/Button';
import { Card, CardContent } from '@/components/wrappers/Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * @class ErrorBoundary
 * @description Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">😵</div>
              <h1 className="text-2xl font-bold text-primary">Something went wrong</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try again or contact support if the problem persists.
              </p>
              {this.state.error && (
                <details className="text-left text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <summary className="cursor-pointer font-medium">Error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">{this.state.error.message}</pre>
                </details>
              )}
              <div className="flex gap-3 justify-center pt-2">
                <Button onClick={this.handleReset}>Try Again</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * @component RouteErrorBoundary
 * @description Error boundary specifically for route-level errors with navigation options.
 */
const RouteErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Route error:', error.message, errorInfo.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export { ErrorBoundary, RouteErrorBoundary };
