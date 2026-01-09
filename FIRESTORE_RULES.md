# Regras de Segurança do Firestore

Este documento explica as regras de segurança implementadas para o Firestore do VitaLog.

## Estrutura de Dados

Os dados são organizados por usuário na seguinte estrutura:

```
users/
  {userId}/
    foodEntries/
      {entryId}
    diets/
      {dietId}
    habits/
      {habitId}
    entries/
      {entryId}
    mealCategories/
      {categoryId}
```

## Regras Principais

### 1. Autenticação Obrigatória
- Todas as operações requerem autenticação
- Apenas usuários autenticados podem acessar o banco de dados

### 2. Isolamento por Usuário
- Cada usuário só pode acessar seus próprios dados
- Usuários não podem ler ou modificar dados de outros usuários
- A validação é feita comparando `request.auth.uid` com o `userId` no caminho

### 3. Validação de Estrutura de Dados

#### FoodEntry
- **Campos obrigatórios**: `id`, `mealType`, `createdAt`, `type`, `tags`
- **Campos opcionais**: `text`, `imageUrl`, `audioUrl`, `observation`, `dietId`
- Validação de tipos: strings, arrays, etc.

#### Diet
- **Campos obrigatórios**: `id`, `name`, `isActive`
- **Campos opcionais**: `description`, `startDate`, `endDate`, `notes`, `attachmentUrl`, `attachmentType`
- `attachmentType` deve ser 'image' ou 'pdf' se fornecido

#### Habit
- **Campos obrigatórios**: `id`, `name`, `frequencyPerWeek`, `isArchived`, `createdAt`
- **Campos opcionais**: `colorHex`
- `frequencyPerWeek` deve ser um número inteiro

#### Entry (para hábitos)
- **Campos obrigatórios**: `id`, `habitId`, `createdAt`, `type`, `tags`
- **Campos opcionais**: `text`, `imageUrl`, `audioUrl`, `mood`, `energy`
- `mood` e `energy` devem ser números inteiros se fornecidos

#### MealCategory
- **Campos obrigatórios**: `id`, `name`, `mealType`, `isArchived`, `createdAt`
- **Campos opcionais**: `colorHex`

## Operações Permitidas

Para cada coleção, as seguintes operações são permitidas:

- **read**: Ler documentos (apenas do próprio usuário)
- **write**: Criar, atualizar ou deletar (apenas do próprio usuário)
- **create**: Criar novos documentos (com validação)
- **update**: Atualizar documentos existentes (com validação)
- **delete**: Deletar documentos

## Como Aplicar as Regras

### Opção 1: Firebase Console
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `vitalog-81cae`
3. Vá em **Firestore Database** > **Regras**
4. Cole o conteúdo do arquivo `firestore.rules`
5. Clique em **Publicar**

### Opção 2: Firebase CLI
```bash
# Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Login
firebase login

# Inicializar Firebase (se ainda não tiver)
firebase init firestore

# Deploy das regras
firebase deploy --only firestore:rules
```

## Testando as Regras

Você pode testar as regras no Firebase Console:

1. Vá em **Firestore Database** > **Regras**
2. Clique em **Simulador de regras**
3. Configure os parâmetros:
   - **Localização**: `users/{userId}/foodEntries/{entryId}`
   - **Autenticação**: Selecione um usuário de teste
   - **Operação**: read, write, create, update ou delete
   - **Dados**: Adicione dados de exemplo
4. Clique em **Executar** para verificar se a regra passa ou falha

## Segurança Adicional

### Boas Práticas Implementadas:
- ✅ Isolamento completo por usuário
- ✅ Validação de estrutura de dados
- ✅ Validação de tipos
- ✅ Negação explícita de acesso não autorizado
- ✅ Proteção contra injeção de dados maliciosos

### Recomendações:
- Revise as regras periodicamente
- Monitore os logs de acesso no Firebase Console
- Use o simulador de regras antes de fazer deploy
- Mantenha backups das regras em controle de versão

## Exemplo de Uso no Código

```typescript
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/config';
import { authService } from '@/infrastructure/firebase/auth';

// Criar uma entrada de comida
const user = authService.getCurrentUser();
if (user) {
  const foodEntryRef = doc(
    db, 
    `users/${user.uid}/foodEntries/${entryId}`
  );
  await setDoc(foodEntryRef, foodEntryData);
}
```

## Troubleshooting

### Erro: "Missing or insufficient permissions"
- Verifique se o usuário está autenticado
- Verifique se o `userId` no caminho corresponde ao `uid` do usuário autenticado
- Verifique se a estrutura de dados está correta

### Erro: "Invalid data"
- Verifique se todos os campos obrigatórios estão presentes
- Verifique se os tipos de dados estão corretos
- Verifique se os valores opcionais têm os tipos corretos quando presentes

