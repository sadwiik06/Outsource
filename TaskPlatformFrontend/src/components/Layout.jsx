import React from 'react';
import { Navigation } from './Navigation';

export const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
};
