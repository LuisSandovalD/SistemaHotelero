import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, User, Phone, IdCard, Mail, Lock, Shield, Sparkles, CheckCircle, Star } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    identity_document: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        phone: '',
        identity_document: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="flex min-h-screen">
                {/* Panel Derecho - Formulario */}
                <div className="w-full lg:w-1/2 flex items-center justify-center ">
                    <div className="w-full ">
                        <AuthLayout 
                            title="Crear una cuenta" 
                            description="Únete a nosotros y disfruta de una experiencia excepcional"
                        >
                            <form className="space-y-5" onSubmit={submit}>
                                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Nombre completo
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing}
                                                placeholder="Ingresa tu nombre completo"
                                                className="pl-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                        </div>
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Teléfono
                                        </Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                required
                                                tabIndex={2}
                                                autoComplete="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                disabled={processing}
                                                placeholder="+51 123 456 789"
                                                className="pl-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                        </div>
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>
                                </div>

                                {/* Identity Document Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="identity_document" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        Documento de identidad
                                    </Label>
                                    <div className="relative group">
                                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                        <Input
                                            id="identity_document"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            autoComplete="off"
                                            value={data.identity_document}
                                            onChange={(e) => setData('identity_document', e.target.value)}
                                            disabled={processing}
                                            placeholder="DNI, Pasaporte, etc."
                                            className="pl-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        />
                                    </div>
                                    <InputError message={errors.identity_document} className="mt-1" />
                                </div>

                                {/* Email Field */}
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

                                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Contraseña
                                        </Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                tabIndex={5}
                                                autoComplete="new-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                disabled={processing}
                                                placeholder="••••••••"
                                                className="pl-11 pr-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Confirmar contraseña
                                        </Label>
                                        <div className="relative group">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                tabIndex={6}
                                                autoComplete="new-password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                disabled={processing}
                                                placeholder="••••••••"
                                                className="pl-11 pr-11 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-1" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                                    tabIndex={7} 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                                            Creando cuenta...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Crear cuenta
                                        </>
                                    )}
                                </Button>

                                {/* Login Link */}
                                <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        ¿Ya tienes una cuenta?{' '}
                                        <TextLink 
                                            href={route('login')} 
                                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline" 
                                            tabIndex={8}
                                        >
                                            Iniciar sesión
                                        </TextLink>
                                    </p>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    © 2024 Sistema de Gestión Hotelera. Todos los derechos reservados.
                                </p>
                            </div>
                        </AuthLayout>
                    </div>
                </div>

                {/* Panel Izquierdo - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 font-serif">
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-12 text-white w-full">
                        <div className="w-full mx-auto text-center">
                            {/* Hero Image */}
                            <div className="mb-8 relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img 
                                    src="https://th.bing.com/th/id/R.4d5e7bc093fc10955918d2052f78d48b?rik=CenGYNto%2f34XLw&riu=http%3a%2f%2f3.bp.blogspot.com%2f-GxiSGPJMJgI%2fVfb6LRNYilI%2fAAAAAAAAAA4%2fUdPRSE2dCJ0%2fs1600%2fhotel.jpg&ehk=6bVAc7PVuYdFBD8T2T8GFd5rHFRAGQle7JYSk3Rb%2fFA%3d&risl=&pid=ImgRaw&r=0" 
                                    alt="Hotel Maravillas del Mar"
                                    className='relative bg-center w-full h-100 object-cover rounded-3xl shadow-2xl brightness-90 hover:brightness-100 transition-all duration-300 transform group-hover:scale-105'
                                />
                            </div>

                            {/* Hero Text */}
                            <div className="mb-10">
                                <h1 className="text-4xl font-bold leading-tight mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    Únete a Maravillas del Mar
                                </h1>
                                <p className="text-lg text-blue-100 leading-relaxed">
                                    Regístrate y descubre una experiencia única frente al océano Pacífico
                                </p>
                            </div>
                            
                            {/* Benefits Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-center block">Reservas VIP</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                                    <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-center block">Promociones exclusivas</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-center block">Beneficios únicos</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                                    <Shield className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                    <span className="text-sm font-medium text-center block">Máxima seguridad</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}