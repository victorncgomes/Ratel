# Arquitetura do Ratel

## Visão Geral

Ratel é uma aplicação de gerenciamento de caixa de entrada de email que utiliza IA para organizar, classificar e limpar emails automaticamente. A aplicação suporta Gmail e Outlook através de OAuth 2.0.

## Stack Tecnológica

### Frontend
- **Framework**: React 19.2.3 com TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI (Avatar, Dialog, Dropdown, Toast)
- **Virtualização**: @tanstack/react-virtual 3.13.16
- **Gráficos**: Recharts 3.6.0
- **IA**: Google Gemini API (@google/genai 1.34.0)
- **Ícones**: Lucide React 0.562.0

### Backend
- **Runtime**: Node.js com Express
- **APIs**: Gmail API (googleapis), Microsoft Graph API (@microsoft/microsoft-graph-client)
- **Autenticação**: Passport.js com OAuth 2.0
- **Storage**: IndexedDB (idb 8.0.3) para cache local

## Estrutura de Pastas

```
Ratel/
├── public/                      # Assets estáticos
│   ├── favicon.png             # Favicon da aplicação
│   ├── name-ratel.svg          # Logo completo
│   └── sounds/                 # Sons da aplicação
├── server/                      # Backend Node.js
│   ├── auth/                   # Estratégias de autenticação
│   │   ├── google.js          # Google OAuth Strategy
│   │   └── microsoft.js       # Microsoft OAuth Strategy
│   ├── services/               # Lógica de negócio
│   │   ├── analyticsService.js    # Análise de dados
│   │   ├── cleanupService.js      # Limpeza de emails
│   │   ├── emailService.js        # Operações com emails
│   │   ├── outlookService.js      # Integração Outlook
│   │   ├── rateService.js         # Sistema RATE (IA)
│   │   ├── rollupService.js       # Agrupamento de emails
│   │   ├── shieldService.js       # Bloqueio de remetentes
│   │   └── subscriptionDetector.js # Detecção de newsletters
│   ├── server.js               # Servidor Express principal
│   └── package.json            # Dependências do backend
├── src/                         # Frontend React
│   ├── components/             # Componentes React
│   │   ├── icons/             # Ícones customizados
│   │   ├── landing/           # Componentes da landing page
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Activity.tsx
│   │   │   ├── Cleanup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DeepCleaning.tsx
│   │   │   ├── Help.tsx
│   │   │   ├── MailListView.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── PrivacyPage.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── RollupView.tsx
│   │   │   ├── RulesPage.tsx
│   │   │   ├── Subscriptions.tsx
│   │   │   └── TermsPage.tsx
│   │   ├── ui/                # Componentes UI base
│   │   ├── BulkActionsToolbar.tsx
│   │   ├── GroupsColumn.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProcessingScreen.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RateBadge.tsx
│   │   ├── RateFilter.tsx
│   │   ├── RatelFuriosoModal.tsx
│   │   └── VirtualizedEmailList.tsx
│   ├── contexts/               # React Contexts
│   │   ├── LanguageContext.tsx    # Internacionalização
│   │   └── ProgressContext.tsx    # Estado de progresso
│   ├── hooks/                  # Custom Hooks
│   │   ├── useEmails.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useStats.ts
│   │   ├── useSubscriptions.ts
│   │   ├── useTheme.ts
│   │   └── useUserBehavior.ts
│   ├── lib/                    # Utilitários e configurações
│   │   ├── i18n/              # Traduções (pt, es, en)
│   │   ├── mockData.ts        # Dados para modo demo
│   │   └── utils.ts           # Funções utilitárias
│   ├── services/               # Serviços frontend
│   │   └── rateService.ts     # Cliente do sistema RATE
│   ├── styles/                 # Estilos globais
│   ├── App.tsx                 # Componente raiz
│   ├── index.css               # CSS global
│   └── main.tsx                # Entry point
├── docs/                        # Documentação
│   ├── ARCHITECTURE.md         # Este arquivo
│   ├── changelog.md            # Histórico de mudanças
│   └── dialogs.md              # Registro de decisões
├── CHANGELOG.md                 # Changelog principal
├── README.md                    # Documentação do projeto
├── package.json                 # Dependências do frontend
├── tailwind.config.js           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
└── vite.config.ts               # Configuração Vite
```

## Fluxo de Autenticação

### 1. Início do Login
```
Usuário clica em "Login com Google/Microsoft"
    ↓
Frontend redireciona para /api/auth/google ou /api/auth/microsoft
    ↓
Backend inicia fluxo OAuth 2.0 com Passport.js
```

### 2. Callback OAuth
```
Provedor redireciona para /api/auth/google/callback
    ↓
Backend recebe código de autorização
    ↓
Troca código por access_token e refresh_token
    ↓
Busca dados do usuário (nome, email, foto)
    ↓
Redireciona para frontend com dados via URL params
```

### 3. Persistência de Sessão
```
Frontend recebe dados do usuário
    ↓
Armazena em localStorage (chave: 'ratel_user')
    ↓
Exibe ProcessingScreen (simulação de análise)
    ↓
Redireciona para Dashboard
```

### 4. Requisições Autenticadas
```
Frontend envia access_token no header Authorization
    ↓
Backend valida token
    ↓
Faz chamadas para Gmail API ou Microsoft Graph API
    ↓
Retorna dados para frontend
```

## Integração com APIs de Email

### Gmail API

**Escopos utilizados**:
- `https://www.googleapis.com/auth/gmail.readonly` - Leitura de emails
- `https://www.googleapis.com/auth/gmail.modify` - Modificação (arquivar, deletar)

**Principais operações**:
```javascript
// Listar emails
gmail.users.messages.list({ userId: 'me', maxResults: 500, q: 'in:inbox' })

// Obter detalhes
gmail.users.messages.get({ userId: 'me', id: messageId, format: 'metadata' })

// Arquivar
gmail.users.messages.modify({ userId: 'me', id: messageId, removeLabelIds: ['INBOX'] })

// Deletar
gmail.users.messages.trash({ userId: 'me', id: messageId })

// Contagem de spam/trash
gmail.users.messages.list({ userId: 'me', labelIds: ['SPAM'], maxResults: 1 })
```

### Microsoft Graph API

**Escopos utilizados**:
- `Mail.Read` - Leitura de emails
- `Mail.ReadWrite` - Modificação de emails

**Principais operações**:
```javascript
// Listar emails
client.api('/me/mailFolders/inbox/messages').top(500).get()

// Obter detalhes
client.api(`/me/messages/${messageId}`).get()

// Mover para arquivo
client.api(`/me/messages/${messageId}/move`).post({ destinationId: 'archive' })

// Deletar
client.api(`/me/messages/${messageId}`).delete()

// Contagem de spam/trash
client.api('/me/mailFolders/junkemail/messages').count(true).top(1).get()
```

## Sistema de Temas

### Tema NOIR (Dark Mode)
- **Background**: Preto profundo (#000000)
- **Foreground**: Branco gelo (#FAFAFA)
- **Primary**: Vermelho sangue (#DC2626) / Rosa choque (#EC4899)
- **Containers**: Quadrados (rounded-sm)
- **Efeitos**: Glassmorphism sutil

### Tema Claro (Aurora)
- **Background**: Branco (#FFFFFF)
- **Foreground**: Cinza escuro (#18181B)
- **Primary**: Gradientes azul→roxo→rosa
- **Containers**: Quadrados (rounded-sm)
- **Efeitos**: Aurora Glassmorphism

## Componentes Principais

### 1. Dashboard
**Responsabilidade**: Visão geral da caixa de entrada  
**Features**:
- Cards de estatísticas (total, não lidos, spam)
- Gráfico de saúde da inbox
- Quick actions
- Atalhos para funcionalidades principais

### 2. MailListView
**Responsabilidade**: Visualização de emails agrupados  
**Tipos de visualização**:
- Por Remetente (by-sender)
- Por Tamanho (by-size)
- Por Data (by-date)
- Newsletters
- Promoções

**Features**:
- Virtualização com @tanstack/react-virtual
- Seleção múltipla
- Ações em massa (deletar, arquivar, spam)
- Busca e filtros

### 3. Subscriptions
**Responsabilidade**: Gerenciamento de newsletters  
**Features**:
- Lista de todas as inscrições detectadas
- Ações: Manter, Cancelar, Deletar todos
- Ratel Furioso (cancelamento em massa)
- Busca por remetente

### 4. Cleanup
**Responsabilidade**: Limpeza rápida da caixa de entrada  
**Categorias**:
- Emails antigos (>6 meses)
- Não lidos antigos (>30 dias)
- Anexos grandes (>5MB)
- Rascunhos antigos (>7 dias)
- Spam
- Lixeira

### 5. DeepCleaning
**Responsabilidade**: Limpeza avançada com filtros  
**Filtros**:
- Por tamanho mínimo (MB)
- Por data (antes de X)
- Combinação de filtros

### 6. RulesPage (Shield/Rollup)
**Responsabilidade**: Automação de emails  
**Shield**: Bloqueia remetentes automaticamente (move para trash)  
**Rollup**: Agrupa newsletters em resumo diário

## Sistema RATE (IA)

### Conceito
Pontuação 0-100 para cada email baseada em comportamento do usuário.

### Componentes
1. **useUserBehavior**: Hook que rastreia ações (abrir, deletar, arquivar, etc)
2. **rateService**: Calcula score localmente + integração Gemini API
3. **RateBadge**: Componente visual com cores e emojis

### Faixas de Score
- 🔥 **90-100**: Crítico (vermelho)
- ⚡ **70-89**: Importante (laranja)
- ✨ **50-69**: Relevante (amarelo)
- 📬 **30-49**: Normal (azul)
- 💤 **0-29**: Baixa prioridade (cinza)

## Internacionalização (i18n)

### Idiomas Suportados
- Português (pt) - Padrão
- Espanhol (es)
- Inglês (en)

### Estrutura
```typescript
// src/lib/i18n/locales/pt.ts
export const pt = {
  sidebar: {
    email_lists: 'Listas de Email',
    quick_cleanup: 'Limpeza Rápida',
    // ...
  },
  // ...
}
```

### Uso
```tsx
const { t } = useLanguage();
<span>{t('sidebar.email_lists')}</span>
```

## Serviços Backend

### analyticsService.js
- Análise de dados de email
- Estatísticas de uso
- Tendências

### cleanupService.js
- `analyzeInbox()`: Analisa caixa de entrada
- `getEmailsBySize()`: Busca emails grandes
- `getEmailsByDate()`: Busca emails antigos
- `emptyTrash()`: Esvazia lixeira
- `emptySpam()`: Esvazia spam
- `getOutlookSpamTrashCount()`: Contagem Outlook (v0.2.7)

### emailService.js
- CRUD de emails
- Operações em massa
- Busca e filtros

### subscriptionDetector.js
- Detecção automática de newsletters
- Algoritmo de análise de headers
- Agrupamento por remetente

### rateService.js
- Cálculo de score RATE
- Integração com Gemini API
- Machine learning local

### shieldService.js
- Gerenciamento de remetentes bloqueados
- Automação de bloqueio

### rollupService.js
- Agrupamento de newsletters
- Geração de resumos diários

## Rotas da API

### Autenticação
- `GET /api/auth/google` - Inicia OAuth Google
- `GET /api/auth/google/callback` - Callback Google
- `GET /api/auth/microsoft` - Inicia OAuth Microsoft
- `GET /api/auth/microsoft/callback` - Callback Microsoft

### Emails
- `GET /api/emails` - Lista emails
- `GET /api/emails/:id` - Detalhes de um email
- `POST /api/emails/:id/archive` - Arquiva email
- `POST /api/emails/:id/trash` - Move para lixeira
- `DELETE /api/emails/:id` - Deleta email
- `POST /api/emails/bulk-action` - Ação em massa

### Análise
- `GET /api/stats` - Estatísticas gerais
- `GET /api/analytics` - Análise detalhada
- `POST /api/cleanup/analyze` - Analisa inbox

### Limpeza
- `GET /api/cleanup/by-size?minSizeMB=5` - Emails grandes
- `GET /api/cleanup/by-date?beforeDate=2024-01-01` - Emails antigos
- `POST /api/cleanup/empty-trash` - Esvazia lixeira
- `POST /api/cleanup/empty-spam` - Esvazia spam

### Inscrições
- `GET /api/subscriptions` - Lista inscrições
- `POST /api/subscriptions/:id/unsubscribe` - Cancela inscrição
- `POST /api/subscriptions/:id/archive-all` - Arquiva todos
- `DELETE /api/subscriptions/:id/delete-all` - Deleta todos

### Shield/Rollup
- `GET /api/shield` - Lista bloqueados
- `POST /api/shield` - Adiciona bloqueio
- `DELETE /api/shield/:id` - Remove bloqueio
- `GET /api/rollup` - Lista agrupados
- `POST /api/rollup` - Adiciona ao rollup

## Performance

### Virtualização
- Listas com >100 itens usam `@tanstack/react-virtual`
- Altura estimada: 80px por item
- Overscan: 5 itens

### Caching
- IndexedDB para emails já carregados
- TTL: 5 minutos
- Invalidação ao fazer ações

### Otimizações
- Debounce em buscas (300ms)
- React.memo em componentes de lista
- Lazy loading de imagens
- Code splitting por rota

## Segurança

### Tokens
- Access tokens armazenados em localStorage
- Refresh tokens no backend (sessão)
- Validação em cada requisição

### CORS
- Whitelist de origens permitidas
- Credentials: true

### Rate Limiting
- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário

## Deploy

### Frontend (Vercel)
- Build: `npm run build`
- Output: `dist/`
- Variáveis de ambiente: `VITE_API_URL`

### Backend (Vercel Serverless)
- Entry: `server/server.js`
- Variáveis de ambiente:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `MICROSOFT_CLIENT_ID`
  - `MICROSOFT_CLIENT_SECRET`
  - `GEMINI_API_KEY`
  - `SESSION_SECRET`

## Modo Demo

### Funcionamento
- Não requer login
- Usa dados mockados de `lib/mockData.ts`
- Todas as ações são simuladas
- Permite explorar funcionalidades

### Dados Mock
- 150 emails simulados
- 12 inscrições
- Estatísticas realistas
- Remetentes variados

## Próximos Passos

1. **Testes Automatizados**: Jest + React Testing Library
2. **PWA**: Service Worker para offline
3. **Notificações Push**: Alertas de emails importantes
4. **Integração com mais provedores**: Yahoo, ProtonMail
5. **Machine Learning local**: Melhorar RATE sem API externa
6. **Exportação de dados**: CSV, JSON
7. **Temas customizáveis**: Editor de cores

---

*Última atualização: 2026-01-06*
