import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-secondary text-text transition-colors duration-300">
      <div className="flex min-h-screen flex-col">
        
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content */}
        <main
          className="
            flex-1
            px-4 py-6
            sm:px-6
            lg:px-10 lg:py-8
          "
        >
          <div
            className="
              mx-auto
              max-w-screen-2xl
              animate-in fade-in duration-500
            "
          >
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};