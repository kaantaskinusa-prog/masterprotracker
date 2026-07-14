'use client';
import { useState } from 'react';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      onLogin();
    } else {
      alert('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-white">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#1e293b] p-8 rounded-3xl border border-blue-900 shadow-2xl">
        <h1 className="text-2xl font-black text-cyan-400 mb-6 text-center">MASTER PRO GİRİŞ</h1>
        <input 
          type="text" placeholder="Kullanıcı Adı (admin)" 
          className="w-full bg-[#0f172a] p-3 rounded-xl mb-4 border border-blue-900"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" placeholder="Şifre (123)" 
          className="w-full bg-[#0f172a] p-3 rounded-xl mb-6 border border-blue-900"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          GİRİŞ YAP
        </button>
      </form>
    </div>
  );
}