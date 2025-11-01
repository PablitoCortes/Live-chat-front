'use client'

import { RegisterData } from '@/interfaces/User';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import { AtSign, Eye, EyeOff, Lock, User } from 'lucide-react';

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
  });

  const { register } = useAuth();
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      await register(registerData.name,registerData.email, registerData.password, );
      setTimeout(()=>{
        setRegisterLoading(false);
        router.push('/home')
      },2000)
      
    } catch (err){
        if (err instanceof Error)
      alert(err.message);
    }finally{
      setRegisterLoading(false)
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary to-secondary">
      <div className="absolute top-0 left-0 w-64 h-64 bg-message/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-message/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="w-full max-w-md px-6 py-8 bg-secondary/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 z-10 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-message rounded-full p-3 mb-4 shadow-lg">
            <Image 
              src={'/images/live-chat.png'} 
              width={80} 
              height={80} 
              alt={'live-chat'}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Crear cuenta</h1>
          <p className="text-gray-400 text-sm">Únete a nuestra comunidad</p>
        </div>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-300 ml-1">Nombre</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                id="name"
                placeholder="Tu nombre"
                onChange={handleInputChange}
                name="name"
                required
                className="w-full bg-input border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-message/50 transition-all"
              />
            </div>
          </div>
          
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
          
          <button 
            type="submit"
            disabled={registerLoading}
            className="bg-message text-white py-3 rounded-lg font-medium mt-4 hover:bg-message/90 focus:ring-2 focus:ring-message/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {registerLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {registerLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            ¿Ya tienes una cuenta? {" "}
            <Link href="/auth/login" className="text-message hover:text-message/80 font-medium transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;