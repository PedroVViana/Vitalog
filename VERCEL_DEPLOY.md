# Guia de Deploy na Vercel

Este guia fornece instruções detalhadas para fazer o deploy do Vitalog Frontend na Vercel.

## 📋 Pré-requisitos

- ✅ Conta na [Vercel](https://vercel.com) (gratuita)
- ✅ Projeto no GitHub, GitLab ou Bitbucket
- ✅ Credenciais do Firebase configuradas

## 🚀 Deploy Rápido

### Opção 1: Via Interface Web (Recomendado)

1. **Acesse a Vercel:**
   - Vá para [vercel.com/new](https://vercel.com/new)
   - Faça login com sua conta GitHub/GitLab/Bitbucket

2. **Importe o Projeto:**
   - Clique em **Import Project**
   - Selecione o repositório `vitalog-frontend`
   - Clique em **Import**

3. **Configure o Projeto:**
   - Framework Preset: **Next.js** (detectado automaticamente)
   - Root Directory: `./` (raiz do projeto)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)
   - Install Command: `npm install` (padrão)

4. **Adicione as Variáveis de Ambiente:**
   
   Clique em **Environment Variables** e adicione cada uma das seguintes variáveis:
   
   | Nome | Valor |
   |------|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBv1bG_dQFvw3mwHUUyldfrCgo4LNulyPI` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `vitalog-81cae.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `vitalog-81cae` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `vitalog-81cae.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `171924392652` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:171924392652:web:b51652a67006ef06499069` |
   | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-K7NK4YL557` |
   
   ⚠️ **Importante:** Marque todas como disponíveis para **Production**, **Preview** e **Development**.

5. **Faça o Deploy:**
   - Clique em **Deploy**
   - Aguarde o build completar (geralmente 2-3 minutos)
   - Você receberá uma URL: `https://vitalog-frontend-xxxxx.vercel.app`

### Opção 2: Via CLI da Vercel

1. **Instale a CLI da Vercel:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
   vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
   vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   ```
   
   Para cada variável, insira o valor quando solicitado.

4. **Faça o deploy:**
   ```bash
   vercel
   ```
   
   Para produção:
   ```bash
   vercel --prod
   ```

## 🔧 Configurações Pós-Deploy

### Domínio Customizado

1. Vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `vitalog.com`)
3. Siga as instruções para configurar o DNS

### Deploy Automático

- ✅ Cada push para a branch `main` ou `master` faz deploy automático em produção
- ✅ Pull requests recebem URLs de preview automaticamente
- ✅ Você pode desabilitar isso em **Settings** > **Git**

### Variáveis de Ambiente por Ambiente

Você pode ter valores diferentes para:
- **Production:** Ambiente de produção
- **Preview:** Deploys de branches e PRs
- **Development:** Ambiente local via `vercel dev`

Configure isso ao adicionar cada variável na interface da Vercel.

## 🐛 Troubleshooting

### Build Falha

1. **Verifique os logs:**
   - Vá em **Deployments** > Selecione o deploy > **View Build Logs**
   - Procure por erros específicos

2. **Verifique variáveis de ambiente:**
   - Vá em **Settings** > **Environment Variables**
   - Certifique-se de que todas as variáveis estão configuradas
   - Verifique se estão marcadas para o ambiente correto

3. **Erros comuns:**
   - `Module not found`: Verifique se todas as dependências estão no `package.json`
   - `Environment variable not found`: Adicione a variável na Vercel
   - `Firebase error`: Verifique se as credenciais do Firebase estão corretas
   - `Type error`: Verifique se todas as chaves de tradução estão definidas nos arquivos de locale
   - `Invalid next.config.ts`: Verifique se a configuração do Next.js está correta

### Problemas Corrigidos

Os seguintes problemas foram corrigidos no projeto:

✅ **next.config.ts**: Removida configuração experimental inválida do Turbopack
✅ **package.json**: Corrigido script de lint para usar `next lint`
✅ **Traduções**: Adicionadas chaves faltantes `mealCategoryForm` nos arquivos de locale (en.ts e pt.ts)
✅ **vercel.json**: Criado arquivo de configuração para garantir deploy correto

Se você ainda encontrar erros, verifique se:
- Todas as dependências estão instaladas (`npm install`)
- O build funciona localmente (`npm run build`)
- Não há erros de TypeScript (`npm run build`)

### Aplicação não funciona após deploy

1. **Verifique o console do navegador:**
   - Abra DevTools (F12)
   - Veja se há erros no Console

2. **Verifique o Firebase:**
   - Certifique-se de que o domínio da Vercel está autorizado no Firebase
   - Vá em Firebase Console > Authentication > Settings > Authorized domains
   - Adicione seu domínio da Vercel (ex: `vitalog-frontend.vercel.app`)

3. **Teste localmente:**
   ```bash
   npm run build
   npm start
   ```
   Se funcionar localmente, o problema pode ser com variáveis de ambiente na Vercel.

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Next.js - Deploy](https://nextjs.org/docs/app/building-your-application/deploying)
- [Configuração do Firebase para Web](https://firebase.google.com/docs/web/setup)

## ✅ Checklist de Deploy

- [ ] Projeto importado na Vercel
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Aplicação acessível via URL da Vercel
- [ ] Firebase autorizado para o domínio da Vercel
- [ ] Testes básicos realizados (login, navegação)
- [ ] Domínio customizado configurado (opcional)

---

**Pronto!** Seu projeto está no ar! 🎉
