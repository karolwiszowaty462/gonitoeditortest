import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (!success) {
        setError('email', { message: 'Nieprawidłowe dane logowania' });
      }
    } catch (error) {
      setError('email', { message: 'Wystąpił błąd podczas logowania' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Adres email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="email"
            {...register('email', { 
              required: 'Email jest wymagany',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Nieprawidłowy format email'
              }
            })}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="twoj@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Hasło
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', { 
              required: 'Hasło jest wymagane',
              minLength: {
                value: 6,
                message: 'Hasło musi mieć co najmniej 6 znaków'
              }
            })}
            className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Wprowadź hasło"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isLoading ? 'Logowanie...' : 'Zaloguj się'}
      </button>

      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Nie masz konta?{' '}
          <button type="button" className="text-blue-400 hover:text-blue-300">
            Zarejestruj się
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;