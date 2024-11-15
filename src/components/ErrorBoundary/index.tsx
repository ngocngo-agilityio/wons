'use client';

import { cn } from '@nextui-org/react';

// Components
import { Button, Heading, Text } from '@/components';

interface ErrorProps {
  error: (Error & { digest?: string }) | string;
  reset?: () => void;
  className?: string;
}

const ErrorBoundary = ({ error, reset, className = '' }: ErrorProps) => {
  // Attempt to recover by trying to re-render the segment
  const handleReset = () => {
    reset?.();
  };

  return (
    <div
      className={cn(
        'text-center h-screen flex justify-center items-center flex-col',
        className,
      )}
    >
      <Heading title="Something went wrong!" className="text-4xl" />
      <Text text={typeof error === 'string' ? error : ''} />
      <Button onClick={handleReset} color="primary" className="mt-8">
        Try again
      </Button>
    </div>
  );
};

export default ErrorBoundary;
