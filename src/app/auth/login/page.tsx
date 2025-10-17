'use client';

import { LoginData } from '@/interfaces/User';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import GoogleLoginButton from '@/components/GoogleLoginButton/GoogleLoginButton';
import Image from 'next/image';

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);

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
    <div className="flex flex-col md:flex-row items-center h-screen justify-center bg-gray-500 gap-4">
      <Image src={'/images/live-chat.png'} width={300} height={300} alt={'live-chat'}></Image>
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              placeholder="E-mail"
              onChange={handleInputChange}
              name="email"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">password</label>
            <input
              type="password"
              placeholder="*****"
              onChange={handleInputChange}
              name="password"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <button className="bg-primary text-white p-2 rounded-md">
            {loginLoading ? 'Cargando...' : 'Login'}
          </button>
        </form>
        <div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
