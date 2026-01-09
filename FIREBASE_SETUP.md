# Configuração do Firebase

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBv1bG_dQFvw3mwHUUyldfrCgo4LNulyPI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vitalog-81cae.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vitalog-81cae
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vitalog-81cae.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=171924392652
NEXT_PUBLIC_FIREBASE_APP_ID=1:171924392652:web:b51652a67006ef06499069
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K7NK4YL557
```

## Configuração no Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `vitalog-81cae`
3. Vá em **Authentication** > **Sign-in method**
4. Habilite os seguintes métodos:
   - **Email/Password**: Ative e salve
   - **Google**: Ative, configure o email de suporte e salve

## Funcionalidades Implementadas

✅ Autenticação com Email/Senha
✅ Autenticação com Google
✅ Página de Login
✅ Proteção de Rotas
✅ Gerenciamento de Estado (Redux)
✅ Botão de Logout na Sidebar

## Estrutura de Arquivos

- `src/infrastructure/firebase/config.ts` - Configuração do Firebase
- `src/infrastructure/firebase/auth.ts` - Serviço de autenticação
- `src/presentation/store/slices/authSlice.ts` - Redux slice para autenticação
- `src/app/login/page.tsx` - Página de login
- `src/presentation/components/auth/AuthGuard.tsx` - Componente de proteção de rotas

