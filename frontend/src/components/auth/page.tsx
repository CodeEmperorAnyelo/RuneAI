// app/auth/page.tsx
'use client';
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-3xl font-bold text-center text-white">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-sm text-slate-400 hover:text-white"
        >
          {isLogin ? 'Need an account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
}