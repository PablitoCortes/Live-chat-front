'use client'

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Image from 'next/image';
import Link from 'next/link';
import { AtSign, Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';

const RecoverPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar errores del campo cuando el usuario empieza a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'El formato del correo electrónico no es válido';
      }
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'La contraseña es requerida';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.recoverPassword(formData.email, formData.newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      if (error instanceof Error) {
        setErrors({
          general: error.message || 'Error al recuperar la contraseña. Por favor, intenta de nuevo.',
        });
      } else {
        setErrors({
          general: 'Error al recuperar la contraseña. Por favor, intenta de nuevo.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.confirmPassword && formData.newPassword === formData.confirmPassword;
  const passwordsDontMatch = formData.confirmPassword && formData.newPassword !== formData.confirmPassword;

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
          <h1 className="text-2xl font-bold text-white mb-1">Recuperar contraseña</h1>
          <p className="text-gray-400 text-sm">Ingresa tu correo y tu nueva contraseña</p>
        </div>
        
        {success ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-white text-center">
              ¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                <XCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">
                Correo electrónico
              </label>
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
                  value={formData.email}
                  required
                  className={`w-full bg-input border rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:ring-message/50'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs ml-1">{errors.email}</p>
              )}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-sm font-medium text-gray-300 ml-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                  name="newPassword"
                  value={formData.newPassword}
                  required
                  className={`w-full bg-input border rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.newPassword 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:ring-message/50'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-xs ml-1">{errors.newPassword}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 ml-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  required
                  className={`w-full bg-input border rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword || passwordsDontMatch
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : passwordsMatch
                      ? 'border-green-500 focus:ring-green-500/50'
                      : 'border-gray-700 focus:ring-message/50'
                  }`}
                />
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  {passwordsMatch && formData.confirmPassword && (
                    <CheckCircle size={18} className="text-green-500" />
                  )}
                  {passwordsDontMatch && (
                    <XCircle size={18} className="text-red-500" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs ml-1">{errors.confirmPassword}</p>
              )}
              {passwordsMatch && formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-green-400 text-xs ml-1 flex items-center gap-1">
                  <CheckCircle size={14} /> Las contraseñas coinciden
                </p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={loading || !passwordsMatch}
              className="bg-message text-white py-3 rounded-lg font-medium mt-2 hover:bg-message/90 focus:ring-2 focus:ring-message/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Actualizando contraseña...
                </>
              ) : (
                'Recuperar contraseña'
              )}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            ¿Recordaste tu contraseña? {" "}
            <Link href="/auth/login" className="text-message hover:text-message/80 font-medium transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;

