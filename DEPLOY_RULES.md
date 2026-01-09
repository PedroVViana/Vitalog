# Como Aplicar as Regras do Firestore

## Método 1: Firebase Console (Mais Simples)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto **vitalog-81cae**
3. No menu lateral, clique em **Firestore Database**
4. Vá para a aba **Regras**
5. Abra o arquivo `firestore.rules` neste projeto
6. Copie todo o conteúdo do arquivo
7. Cole no editor de regras do Firebase Console
8. Clique em **Publicar**

## Método 2: Firebase CLI (Recomendado para Produção)

### Instalação

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Ou usar npx (sem instalação global)
npx firebase-tools login
```

### Configuração Inicial

```bash
# Login no Firebase
firebase login

# Verificar se está conectado ao projeto correto
firebase projects:list

# Se necessário, definir o projeto
firebase use vitalog-81cae
```

### Deploy das Regras

```bash
# Deploy apenas das regras
firebase deploy --only firestore:rules

# Deploy das regras e índices
firebase deploy --only firestore
```

### Verificar Status

```bash
# Ver regras atuais
firebase firestore:rules:get

# Ver índices
firebase firestore:indexes
```

## Método 3: Script NPM (Opcional)

Você pode adicionar scripts no `package.json`:

```json
{
  "scripts": {
    "firebase:deploy:rules": "firebase deploy --only firestore:rules",
    "firebase:deploy:indexes": "firebase deploy --only firestore:indexes",
    "firebase:deploy:firestore": "firebase deploy --only firestore"
  }
}
```

Depois execute:
```bash
npm run firebase:deploy:rules
```

## Verificação

Após aplicar as regras:

1. Vá no Firebase Console > Firestore Database > Regras
2. Verifique se as regras foram aplicadas corretamente
3. Use o **Simulador de regras** para testar:
   - Configure um caminho: `users/{userId}/foodEntries/{entryId}`
   - Selecione uma operação (read, write, etc.)
   - Adicione dados de exemplo
   - Execute e verifique se passa ou falha

## Estrutura de Arquivos

Os seguintes arquivos foram criados:

- `firestore.rules` - Regras de segurança do Firestore
- `firestore.indexes.json` - Índices compostos para consultas
- `.firebaserc` - Configuração do projeto Firebase
- `firebase.json` - Configuração do Firebase (regras, hosting, etc.)
- `FIRESTORE_RULES.md` - Documentação das regras
- `DEPLOY_RULES.md` - Este arquivo (instruções de deploy)

## Troubleshooting

### Erro: "Permission denied"
- Verifique se você está logado: `firebase login`
- Verifique se o projeto está correto: `firebase use vitalog-81cae`

### Erro: "Rules file is invalid"
- Verifique a sintaxe das regras no Firebase Console
- Use o validador de regras no console

### Erro: "Project not found"
- Verifique se você tem acesso ao projeto no Firebase Console
- Verifique o ID do projeto em `.firebaserc`

## Próximos Passos

1. ✅ Aplicar as regras no Firebase Console ou via CLI
2. ✅ Testar as regras usando o simulador
3. ✅ Configurar os índices compostos (se necessário)
4. ✅ Atualizar o código para usar Firestore em vez de localStorage

