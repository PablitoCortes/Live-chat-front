'use client';

import { LoginData} from '@/interfaces/User';
import { ChangeEvent, useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';


const Login = () => {

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });
   
  const { user, login, isProfileLoaded } = useUser()
  const [loginLoading, setLoginLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true)
    try {
      await login(loginData.email, loginData.password);
      setLoginLoading(false)
      router.push("/home");
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };


  if (loginLoading===true) {
    return (
      <>Cargando...</>
    )
  }
  return (
    <div className="flex flex-col items-center bg-gray-500">
      <h1>Login</h1>
      <form className="flex flex-col bg-amber-600" onSubmit={handleSubmit}>
        <label htmlFor="email">email or username</label>
        <input
          type="text"
          placeholder="email or username"
          onChange={handleInputChange}
          name="email"
        />
        <label htmlFor="password">password</label>
        <input type="password" placeholder="*****" onChange={handleInputChange} name="password" />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
