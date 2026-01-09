'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { setUser, setError, clearError } from '@/presentation/store/slices/authSlice';
import { authService } from '@/infrastructure/firebase/auth';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Card } from '@/presentation/components/ui/Card';
import { Mail, Lock, LogIn } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Redirect if already logged in
        if (user && !loading) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribe = authService.onAuthStateChange((user) => {
            dispatch(setUser(user));
            if (user) {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [dispatch, router]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        if (isSignUp && password !== confirmPassword) {
            dispatch(setError('As senhas não coincidem'));
            return;
        }

        if (password.length < 6) {
            dispatch(setError('A senha deve ter pelo menos 6 caracteres'));
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                await authService.signUpWithEmail(email, password);
            } else {
                await authService.signInWithEmail(email, password);
            }
        } catch (err: any) {
            let errorMessage = 'Ocorreu um erro ao fazer login';
            
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'Usuário não encontrado';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Senha incorreta';
            } else if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Este email já está em uso';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'A senha é muito fraca';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            dispatch(setError(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        dispatch(clearError());
        setIsLoading(true);
        try {
            await authService.signInWithGoogle();
        } catch (err: any) {
            let errorMessage = 'Ocorreu um erro ao fazer login com Google';
            if (err.message) {
                errorMessage = err.message;
            }
            dispatch(setError(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Carregando...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>VitaLog</h1>
                    <p className={styles.subtitle}>
                        {isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta'}
                    </p>
                </div>

                <form onSubmit={handleEmailAuth} className={styles.form}>
                    <Input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                    />

                    <Input
                        type="password"
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />

                    {isSignUp && (
                        <Input
                            type="password"
                            label="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    )}

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        <LogIn size={18} />
                        {isSignUp ? 'Criar Conta' : 'Entrar'}
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span>ou</span>
                </div>

                <Button
                    onClick={handleGoogleSignIn}
                    variant="ghost"
                    fullWidth
                    disabled={isLoading}
                    className={styles.googleButton}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H15.9564C17.1582 14.7227 17.64 13.2182 17.64 9.20454Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L11.0477 13.5614C10.2418 14.1014 9.21091 14.4204 9 14.4204C6.65455 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                            fill="#34A853"
                        />
                        <path
                            d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M9 3.57955C10.3218 3.57955 11.5077 4.03364 12.4409 4.92545L15.0218 2.34455C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65455 3.57955 9 3.57955Z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continuar com Google
                </Button>

                <div className={styles.footer}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            dispatch(clearError());
                            setPassword('');
                            setConfirmPassword('');
                        }}
                        className={styles.toggleButton}
                        disabled={isLoading}
                    >
                        {isSignUp
                            ? 'Já tem uma conta? Entrar'
                            : 'Não tem uma conta? Criar conta'}
                    </button>
                </div>
            </div>
        </div>
    );
}

