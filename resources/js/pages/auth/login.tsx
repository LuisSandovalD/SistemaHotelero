import { useForm } from '@inertiajs/react';
import { CheckCircle, LoaderCircle, Mail, Shield, Sparkles, Star,Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

const benefits = [
  { icon: Star, text: 'Reservas VIP', color: 'text-yellow-400' },
  { icon: Sparkles, text: 'Promociones exclusivas', color: 'text-blue-400' },
  { icon: CheckCircle, text: 'Beneficios únicos', color: 'text-green-400' },
  { icon: Shield, text: 'Máxima seguridad', color: 'text-indigo-400' },
];

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } =
    useForm<Required<LoginForm>>({
      email: '',
      password: '',
      remember: false,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="flex min-h-screen w-full">
        {/* Lado Izquierdo */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 font-serif">
          <div className="relative z-10 flex flex-col justify-center px-12 text-white w-full text-center">
            {/* Imagen */}
            <div className="mb-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl blur-lg opacity-75 transition-opacity duration-300 group-hover:opacity-100"></div>
              <img
                src="https://th.bing.com/th/id/R.4d5e7bc093fc10955918d2052f78d48b?rik=CenGYNto%2f34XLw&riu=http%3a%2f%2f3.bp.blogspot.com%2f-GxiSGPJMJgI%2fVfb6LRNYilI%2fAAAAAAAAAA4%2fUdPRSE2dCJ0%2fs1600%2fhotel.jpg&ehk=6bVAc7PVuYdFBD8T2T8GFd5rHFRAGQle7JYSk3Rb%2fFA%3d&risl=&pid=ImgRaw&r=0"
                alt="Hotel Maravillas del Mar"
                className="relative w-full h-100 object-cover rounded-3xl shadow-2xl brightness-90 transition-all duration-300 transform group-hover:scale-105 hover:brightness-100"
              />
            </div>

            {/* Texto de bienvenida */}
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Bienvenido a Maravillas del Mar
            </h1>
            <p className="text-lg text-blue-100 mb-10 leading-relaxed">
              Tu refugio frente al océano. El lugar perfecto para descansar,
              divertirte y crear recuerdos inolvidables con tu familia y amigos.
            </p>

            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:bg-white/15"
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                  <span className="text-sm font-medium block">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <AuthLayout
            title="Inicia sesión en tu cuenta"
            description="Ingresa tu correo electrónico y contraseña para continuar"
          >
            <form className="flex flex-col gap-6" onSubmit={submit}>
              <div className="grid gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Correo electrónico
                  </Label>
                  <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <Input
                          id="email"
                          type="email"
                          required
                          tabIndex={4}
                          autoComplete="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          disabled={processing}
                          placeholder="correo@ejemplo.com"
                          className="pl-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                  </div>
                  <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className='text-sm font-semibold text-gray-800 dark:text-gray-200'>Contraseña</Label>
                    {canResetPassword && (
                      <TextLink
                        href={route('password.request')}
                        className="ml-auto text-sm"
                        tabIndex={5}
                      >
                        ¿Olvidaste tu contraseña?
                      </TextLink>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                        id="password"
                        type={"password"}
                        required
                        tabIndex={5}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        disabled={processing}
                        placeholder="••••••••"
                        className="pl-11 pr-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    
                </div>
                  <InputError message={errors.password} />
                </div>

                {/* Remember */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    checked={data.remember}
                    onClick={() => setData('remember', !data.remember)}
                    tabIndex={3}
                  />
                  <Label htmlFor="remember">Recordarme</Label>
                </div>

                {/* Botón */}
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  tabIndex={4}
                  disabled={processing}
                >
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Iniciar sesión
                </Button>
              </div>

              {/* Registro */}
              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <TextLink href={route('register')} tabIndex={5}>
                  Regístrate
                </TextLink>
              </p>
            </form>
                <a
                  href="/auth/google"
                  className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Iniciar sesión con Google</span>
                </a>


            {status && (
              <div className="mt-4 text-center text-sm font-medium text-green-600">
                {status}
              </div>
            )}
          </AuthLayout>
        </div>
      </div>
    </main>
  );
}
