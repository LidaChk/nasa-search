import React, { ReactNode } from 'react';

interface ErrorCatchWrapperProps {
  error: string | null;
  children: ReactNode;
}

const ErrorCatchWrapper: React.FC<ErrorCatchWrapperProps> = ({
  error,
  children,
}) => {
  if (error) {
    throw new Error(error);
  }
  return children;
};

export default ErrorCatchWrapper;
