This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Projeto no GitHub, GitLab ou Bitbucket (recomendado)

### Passo a Passo

1. **Conecte seu repositório à Vercel:**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Conecte seu repositório Git
   - Selecione o projeto `vitalog-frontend`

2. **Configure as Variáveis de Ambiente:**
   
   Na Vercel, vá em **Settings** > **Environment Variables** e adicione:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBv1bG_dQFvw3mwHUUyldfrCgo4LNulyPI
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vitalog-81cae.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=vitalog-81cae
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vitalog-81cae.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=171924392652
   NEXT_PUBLIC_FIREBASE_APP_ID=1:171924392652:web:b51652a67006ef06499069
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K7NK4YL557
   ```

3. **Configure o Build:**
   - Framework Preset: **Next.js** (detectado automaticamente)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)
   - Install Command: `npm install` (padrão)

4. **Deploy:**
   - Clique em **Deploy**
   - A Vercel fará o build e deploy automaticamente
   - Você receberá uma URL do tipo: `https://vitalog-frontend.vercel.app`

### Configurações Adicionais

- **Domínio Customizado:** Vá em **Settings** > **Domains** para adicionar seu domínio
- **Deploy Automático:** Cada push para a branch principal fará deploy automático
- **Preview Deploys:** Pull requests recebem URLs de preview automaticamente

### Troubleshooting

- Se o build falhar, verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs de build na Vercel para identificar erros
- Certifique-se de que o Firebase está configurado corretamente (veja `FIREBASE_SETUP.md`)

Para mais detalhes, consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
