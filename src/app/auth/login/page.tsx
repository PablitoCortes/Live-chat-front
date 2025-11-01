'use client';

import { LoginData } from '@/interfaces/User';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { AtSign, Eye, EyeOff, Lock } from 'lucide-react';

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(loginData.email, loginData.password);
      setTimeout(()=>{
        setLoginLoading(false);
        router.push('/home')
      },2000)
      
    } catch {
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }finally{
      setLoginLoading(false)
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary to-secondary">
      {/* Círculos decorativos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-message/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-message/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="w-full max-w-md px-6 py-8 bg-secondary/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 z-10 animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-message rounded-full p-3 mb-4 shadow-lg">
            <Image 
              src={'/images/live-chat.png'} 
              width={80} 
              height={80} 
              alt={'live-chat'}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido de nuevo</h1>
          <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
        </div>
        
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Correo electrónico</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <AtSign size={18} />
              </div>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                onChange={handleInputChange}
                name="email"
                required
                className="w-full bg-input border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-message/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                onChange={handleInputChange}
                name="password"
                required
                className="w-full bg-input border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-message/50 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link href="/auth/recover-password" className="text-sm text-message hover:text-message/80 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <button 
            type="submit"
            disabled={loginLoading}
            className="bg-message text-white py-3 rounded-lg font-medium mt-2 hover:bg-message/90 focus:ring-2 focus:ring-message/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loginLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {loginLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            ¿No tienes una cuenta? {" "}
            <Link href="/auth/register" className="text-message hover:text-message/80 font-medium transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
