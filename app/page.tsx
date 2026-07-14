'use client';

import LoginPage from './LoginPage';
import { useState } from 'react';
import Calculator from './Calculator'; 
import LoginPage from './LoginPage';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Calculator />;
}