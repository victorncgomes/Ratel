# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.2.9] - 2026-01-06

### 🎮 Sistema de Gamificação COMPLETO

#### Design System Neobrutalist
- **`neobrutalism.css`** - Estilo inspirado em Super Mario Bros SNES + Anime Noir
  - Bordas pretas grossas (4px), sombras offset (8px), sem border-radius
  - Cores: preto, branco, branco-gelo (#F5F5F5), vermelho acento (#E63946)
  - Componentes: cards, botões, badges, barras de progresso, territórios
  - Animações: pulse, bounce, shake
  - Responsivo para mobile

#### Frases Engraçadas Trilíngue (80 iniciais → 200)
- **`funnyMessages.ts`** - Tabela editável PT/EN/ES
  - Categorias: Política, Stalker, Absurdo, Tech/Nerd, Cotidiano, Autoironia IA
  - Rotação automática a cada 3 segundos no LoadingScreen
  - Funções: `getRandomFunnyMessage()`, `getAllFunnyMessages()`, `getFunnyMessageById()`

#### Sistema de Badges (15 iniciais)
- **`badges.ts`** - Badges trilíngue com tiers Bronze/Silver/Gold
  - First Blood, Honey Badger, Spam Slayer, Newsletter Destroyer
  - Week Warrior, Month Master, Inbox Zero Hero, Email Annihilator
  - Badges secretos: Night Owl, Speed Demon
  - Recompensas: 10-1000 créditos por badge

#### Sistema de Territórios (4 mapas)
- **`territories.ts`** - Progressão estilo Super Mario
  - Floresta do Spam (100 emails, 10 unsubs)
  - Montanha das Newsletters (500 emails, 50 unsubs)
  - Deserto Corporativo (1000 emails, 100 unsubs)
  - Infinito e Além (∞)
  - Inimigos: Chacal, Leão, Tigre, Elefante

#### Sistema de Créditos Freemium
- **`credits.ts`** - Economia com limites diários
  - FREE: 10 exclusões + 5 unsubscribes/dia, 100 créditos iniciais
  - PRO: Ações ilimitadas, todos os badges/territórios
  - Ganhos: +2 por email, +5 por unsub, +50 por badge, +200 por território

#### Hooks de Gamificação
- **`useProgression.ts`** - Gerencia progressão, streaks, territórios
- **`useBadges.ts`** - Verificação automática de desbloqueio, cálculo de progresso
- **`useCredits.ts`** - Economia, limites diários, upgrade PRO

#### Componentes React
- **`LoadingScreen.tsx`** - Carregamento até 10k emails com barra de progresso e frases engraçadas
- **`CreditsDisplay.tsx`** - Créditos, streak, ações restantes
- **`BadgeGallery.tsx`** - Galeria com filtros e modal de detalhes
- **`TerritoryNode.tsx`** - Nó do mapa com animações e estados
- **`MapView.tsx`** - Mapa de progressão (substitui Dashboard) estilo Super Mario

### 📁 Novos Arquivos (14 total)
```
src/styles/neobrutalism.css
src/lib/gamification/funnyMessages.ts
src/lib/gamification/badges.ts
src/lib/gamification/territories.ts
src/lib/gamification/credits.ts
src/lib/gamification/index.ts
src/hooks/useProgression.ts
src/hooks/useBadges.ts
src/hooks/useCredits.ts
src/components/gamification/LoadingScreen.tsx
src/components/gamification/CreditsDisplay.tsx
src/components/gamification/BadgeGallery.tsx
src/components/gamification/TerritoryNode.tsx
src/components/gamification/MapView.tsx
src/components/gamification/index.tsx
```

---

## [0.2.7] - 2026-01-06

### 🧹 Auditoria e Limpeza de Código
- **Remoção Completa do Sistema RATE** - Sistema de pontuação AI não funcional removido
  - Deletados 6 arquivos frontend (`RateBadge`, `RateFilter`, `useRate`, `rateService`, `useLabels`, `useUserBehavior`)
  - Deletado 1 arquivo backend (`server/services/rateService.js`)
  - Removido endpoint `/api/rate/calculate`
  - Removidas todas as referências em `MailListView.tsx` e `VirtualizedEmailList.tsx`
- **Hooks Não Utilizados Removidos**
  - `useLabels.ts` - Não estava sendo importado em nenhum componente
  - `useUserBehavior.ts` - Não estava sendo utilizado
- **Código Limpo e Otimizado**
  - Redução de ~7% no total de linhas de código
  - Build de produção sem erros (11.94s)
  - Todas as funcionalidades testadas e operacionais

### 🔧 Melhorias
- **Suporte Completo ao Outlook** - Implementada contagem de spam e lixeira para Microsoft Graph API
  - Função `getOutlookSpamTrashCount` em `cleanupService.js`
  - Integração com `analyzeInbox` para Outlook
- **Favicon** - Adicionado favicon.png para resolver erro 404
- **Documentação** - Criado `docs/ARCHITECTURE.md` com arquitetura completa do projeto
  - Estrutura de pastas detalhada
  - Fluxos de autenticação OAuth
  - Integração com APIs (Gmail/Outlook)
  - Sistema de temas e componentes
  - Rotas da API e serviços backend
- **README** - Atualizado com informações completas do projeto

### ✅ Funcionalidades Verificadas
- Autenticação OAuth (Google + Microsoft) ✅
- Dashboard com estatísticas reais ✅
- Detecção e gerenciamento de newsletters ✅
- Limpeza rápida e Deep Cleaning ✅
- Shield (bloqueio) e Rollup (agrupamento) ✅
- Modo Demo ✅
- Internacionalização (PT/EN/ES) ✅
- Tema claro/escuro ✅



## [0.2.6] - 2026-01-05


### ✨ Novidades
- **Sistema RATE (IA)** - Pontuação inteligente 0-100 para cada email baseada em comportamento
  - `useUserBehavior` hook para tracking de ações
  - `rateService` com cálculo local + integração Gemini API
  - `RateBadge` componente visual com cores e emojis
- **Layout Mailstrom** - Interface três colunas com grupos e contagens
  - `GroupsColumn` para visualização agrupada
  - `BulkActionsToolbar` com Deletar, Bloquear, Spam, Rollup, Cancelar Inscrição
- **Botão Rollup** - Agrupar emails no Rollup diário

### 🎨 Design
- **Tema NOIR (Dark Mode)** - Preto profundo, branco gelo, vermelho sangue/rosa choque
- **Containers Quadrados** - Substituídos rounded-2xl por rounded-sm
- **Aurora Glassmorphism** - Gradientes azul→roxo→rosa no tema claro
- **Removidos Headers Redundantes** - UX mais limpa

### 🔧 Melhorias
- Classificação "Por Data" estilo Mailstrom (Ontem, Esta semana, Meses)
- Subscriptions: Cancelar Tudo movido para ao lado da pesquisa
- Labels página removida (consolidada em outras views)

---

## [0.2.5] - 2026-01-05

### ✨ Novidades
- **UI Glassmorphism/Claymorphism** - Redesign completo
- **Landing Page Premium** - Nova página de entrada com traduções
- **RatelFuriosoModal** simplificado

### 🔧 Melhorias
- Dashboard com cards glass/clay
- Cleanup page com categorias visuais
- Sidebar com menu de usuário

---

## [0.2.4] - 2026-01-05

### ✨ Novidades
- **Página de Termos de Uso** (`/terms`)
- **Página de Política de Privacidade** (`/privacy`)
- **Aceite de Termos no Login** - Checkbox obrigatório

### 🔧 Melhorias
- LoginPage redesenhada com badge de segurança

---

## [0.2.3] - 2026-01-05

### ✨ Novidades
- **Sistema Shield/Rollup** - Backend para bloqueio e agrupamento
- **API de Mensagens Genérica** (`/api/messages`)

### 🔧 Melhorias
- Página de Limpeza exibe contagem real de Spam e Lixeira
- Backend de Análise retorna Rascunhos, Spam e Lixeira

---

## [0.2.2] - 2026-01-04

### 🐛 Correções
- Corrigido erro de sintaxe em `Cleanup.tsx`
- Removidos imports não utilizados
- Sidebar menu Italic corrigido

---

## [0.2.1] - 2026-01-04

### ✨ Novidades
- **Ratel Furioso** - Cancelamento em massa de inscrições
- **Modo Demo** - Funciona sem login

### 🔧 Melhorias
- Dashboard com estatísticas
- Detecção automática de newsletters

---

## [0.2.0] - 2026-01-04 (Release Inicial)

### Funcionalidades
- Login com Google e Microsoft OAuth
- Detecção automática de inscrições/newsletters
- Página de Inscrições com ações: Arquivar, Deletar, Cancelar Inscrição
- Página de Limpeza com análise de emails antigos, grandes e rascunhos
