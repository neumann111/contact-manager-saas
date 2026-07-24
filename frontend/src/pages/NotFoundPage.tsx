import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </Card>
    </div>
  );
};
