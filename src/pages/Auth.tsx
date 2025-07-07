import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { Palette } from 'lucide-react';

const Auth: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">Gonito Editor</h1>
              <p className="text-slate-400 text-sm">Szablony aukcji eBay</p>
            </div>
          </div>
          <p className="text-slate-400">
            Zaloguj się do swojego konta aby kontynuować
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 Gonito Editor. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;