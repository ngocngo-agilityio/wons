'use client';

// Components
import { ErrorBoundary } from '@/components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorProps) => (
  <ErrorBoundary error={error} reset={reset} />
);

export default ErrorPage;
