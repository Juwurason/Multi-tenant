import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorComponent from './ErrorComponent';

const ErrorBoundaryWrapper = ({ children }) => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorComponent}
            onError={(error, info) => {
                // Handle or log the error and the error stack trace
                console.error('Error occurred:', error);
                console.error('Error info:', info);
            }}
            onReset={() => {
                // Optional: Implement any logic to reset the error boundary
                console.log('Error boundary reset.');
            }}
        >
            {error => (
                <ErrorComponent />
            )}
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundaryWrapper;
