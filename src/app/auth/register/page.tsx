'use client'

import { RegisterData } from '@/interfaces/User';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import GoogleLoginButton from '@/components/GoogleLoginButton/GoogleLoginButton';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
  });

  const { register } = useAuth();
  const [registerLoading, setRegisterLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      await register(registerData.email, registerData.password, registerData.name);
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
    <div className="flex flex-col md:flex-row items-center h-screen justify-center gap-4">
      <div className='flex-col items-center'>
        <Image src={'/images/live-chat.png'} width={300} height={300} alt={'live-chat'}></Image>
        
        <p className='text-black'>already have an account? <Link href={"/login"} className='text-xl text-message'> sign-in</Link></p>
      </div>
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              placeholder="example@email.com"
              onChange={handleInputChange}
              name="email"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Name</label>
            <input
              type="text"
              placeholder="Jhon Doe"
              onChange={handleInputChange}
              name="email"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">password</label>
            <input
              type="password"
              placeholder="*********"
              onChange={handleInputChange}
              name="password"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <button className="bg-primary text-white p-2 rounded-md">
            {registerLoading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <div>
          <GoogleLoginButton variant={"register"}/>
        </div>
      </div>
    </div>
  );
};


export default RegisterPage;