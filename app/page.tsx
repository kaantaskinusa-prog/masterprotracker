'use client';

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
'use client';
import { useState } from 'react';
import Calculator from './Calculator'; 
import LoginPage from './LoginPage';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Giriş yapmadıysa sadece Login sayfasını göster
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Giriş yaptıysa hesap makinesini göster
  return <Calculator />;
}