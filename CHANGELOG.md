# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.2.15] - 2026-01-07
### 📦 Roll-Up & Correções
- **Roll-Up Completo**: Painel de configurações com frequência (Diário/Semanal/Mensal) e horário preferido.
- **Notificações Roll-Up**: Preview de próxima notificação e persistência de preferências em localStorage.
- **Menus Corrigidos**: Sidebar agora usa nomes curtos (Listas, Limpeza, Roll-Up) em todos idiomas.
- **Changelog Completo**: Versões 0.0.1 a 0.0.4 adicionadas ao histórico.
- **Mensagens IA Corrigidas**: Texto reflete que usuário decide quais emails são importantes.

## [0.2.14] - 2026-01-07
### 🌍 Internacionalização & UI
- **Traduções Completas**: Menu sidebar, Dashboard e botão "Sobre" em PT/EN/ES.
- **Renomeação "Ratel Furioso"**: Substituído por "Apagar Tudo" em toda aplicação.
- **BadgeGallery Dual Theme**: Suporte completo a Glassmorphism e Neobrutalism.
- **Densidade Visual**: CSS implementado para modos Compacta/Confortável/Espaçosa.
- **Changelog Sincronizado**: Central de Ajuda agora exibe versões 0.2.10-0.2.13.
- **Versão Atualizada**: Exibição correta de v0.2.13 no menu do usuário.

## [0.2.13] - 2026-01-07
### 🛡️ Proteção & Fluxo de Trabalho
- **Subscriptions V2**: Refatoração completa para layout Master-Detail com busca instantânea e ordenação (Volume, Recente, Alfabético).
- **Protection Actions**: Implementadas ações de 'Bloquear', 'Remover de Seguros' e 'Não Importante' diretamente no hub de proteção.
- **Importantes Flow**: Fluxo de triagem na visualização de prioridades com ações 'Manter' (Seguro) e 'Excluir' (Lixo).
- **Code Hardening**: Correções de sintaxe e melhorias na estabilidade dos hooks de dados (`useEmails`).

## [0.2.12] - 2026-01-07
### 🧠 Inteligência & Proteção
- **Importantes View**: Nova visualização com classificação de IA (Score 0-100) e justificativa automática.
- **Protection Hub**: Central unificada para emails Bloqueados, Seguros e Importantes.
- **UX Refinements**: Modal de cancelamento de inscrição (estilo Gmail) e renomeação de ações críticas ("APAGAR TUDO").
- **Listas Avançadas**: Layout split-view para newsletters e filtros de ordenação (Data, Tamanho, Qtd).

## [0.2.11] - 2026-01-06
### 🚑 Correções Críticas e UI
- **Processing Screen Restaurada**: Reativada a tela de carregamento "Ratel Furioso" com frases do "The Sims" e vinculada ao carregamento progressivo real de emails.
- **Correção de Carregamento**: Implementado carregamento em lotes (chunks de 500) para evitar travamento da interface em caixas de entrada grandes (10k+).
- **Ícones da Sidebar**: Substituídos ícones genéricos (olho, balança) por ícones semânticos (User, HardDrive, Newspaper).
- **UI Neobrutalista**: Adicionados headers e estilos de borda/sombra explicitos nas views "Por Remetente", "Tamanho" e "Newsletters".
- **Limpeza de Settings**: Removida barra superior desnecessária no Perfil e corrigido itálico no menu de usuário.

## [0.2.10] - 2026-01-06
### 🎨 Landing Page & Temas
- **Landing Page Dual Theme**: Implementado suporte completo a troca de temas (Glassmorphism e Neobrutalism) em todas as seções (Hero, Features, Stats, Testimonials).
- **Integração de Tema Global**: O seletor de tema agora persiste a escolha e afeta toda a aplicação, incluindo a Landing Page pública.

## [0.2.9] - 2026-01-06
### 🎮 Gamificação Avançada
- **MapView Horizontal**: Layout de mapa de fases estilo "Super Mario World" com scroll horizontal.
- **Sistema de Badges**: Implementada galeria de conquistas com validação automática.
- **Funny Messages**: Adicionadas 200+ frases de carregamento trilíngues.

## [0.2.8] - 2026-01-05
### 💠 Design System Neobrutalism
- **Estilo Visual**: Criação do token de design `neobrutalism` (bordas 4px, sombras duras, cores vibrantes).
- **Componentes**: Adaptação de Cards, Botões e Badges para suportar variante brutalista.

## [0.2.7] - 2026-01-05
### 🧹 Auditoria e Otimização
- **Limpeza de Código**: Remoção do antigo sistema RATE e hooks não utilizados.
- **Outlook Support**: Melhorias na contagem de spam/lixo para contas Microsoft.
- **Architectural Docs**: Criação do `ARCHITECTURE.md` e `RATEL_BLUEPRINT.md`.

## [0.2.6] - 2026-01-04
### 🌍 Internacionalização
- **i18n**: Suporte completo a Português (PT), Inglês (EN) e Espanhol (ES) via `LanguageContext`.
- **Traduções**: Arquivos de tradução JSON para todas as strings da UI.

## [0.2.5] - 2026-01-04
### 🛡️ Shield & Proteção
- **Auto-Block**: Funcionalidade para bloquear remetentes indesejados automaticamente.
- **Spam Analysis**: Detecção aprimorada de padrões de spam baseada em keywords.

## [0.2.4] - 2026-01-03
### 🗞️ Newsletter Management
- **Smart View: Newsletters**: Detecção automática de emails com link de unsubscribe.
- **Rollup**: Funcionalidade para agrupar newsletters em um resumo diário (mockup).

## [0.2.3] - 2026-01-03
### 🧹 Deep Cleaning
- **Filtros Avançados**: Limpeza por tamanho (>5MB) e por antiguidade (>1 ano).
- **Bulk Actions**: Seleção e exclusão em massa com performance otimizada.

## [0.2.2] - 2026-01-02
### 💅 UI Overhaul (Tailwind)
- **Refatoração Visual**: Migração completa de CSS modules para Tailwind CSS.
- **Responsividade**: Layout responsivo para Mobile e Tablet.
- **Sidebar**: Nova navegação retrátil.

## [0.2.1] - 2026-01-02
### 📥 Inbox Features
- **Lista Virtualizada**: Implementação de `tanstack-virtual` para performance em listas longas.
- **Agrupamento**: Visualização de emails agrupados por Remetente.

## [0.2.0] - 2026-01-01
### 🚀 Backend Migration
- **Node.js + Express**: Migração do backend para servidor Express dedicado.
- **API Proxy**: Rotas seguras para comunicar com Gmail/Outlook APIs.

## [0.1.9] - 2025-12-31
### 💾 Data Persistence
- **IndexedDB**: Implementação de cache local para emails usando `idb`.
- **Offline Mode**: Acesso básico a emails cacheados sem internet.

## [0.1.8] - 2025-12-30
### 🔑 Auth System V2
- **Unified Auth**: Sistema de login unificado para Google e Microsoft via Passport.js.
- **Token Refresh**: Gestão automática de renovação de tokens.

## [0.1.7] - 2025-12-28
### 📧 Email Parsing
- **Body Parser**: Extração segura de conteúdo HTML e Texto de emails.
- **Sanitization**: Proteção contra XSS em visualização de emails.

## [0.1.6] - 2025-12-25
### 🔌 Microsoft Integration
- **Outlook API**: Conexão inicial com Microsoft Graph API.
- **Folder Sync**: Sincronização básica de pastas do Outlook.

## [0.1.5] - 2025-12-23
### 🔌 Gmail Integration
- **Gmail API**: Conexão inicial com Google API.
- **Label Sync**: Leitura de labels e categorias do Gmail.

## [0.1.4] - 2025-12-20
### 🏗️ Project Structure
- **Vite Setup**: Migração de CRA para Vite.
- **TypeScript**: Configuração estrita de tipos e interfaces base.

## [0.1.3] - 2025-12-18
### 🎨 Design Concept
- **Mockups**: Prototipagem da interface "Glassmorphism".
- **Assets**: Criação de logo e identidade visual inicial.

## [0.1.2] - 2025-12-15
### 🔐 Auth Prototype
- **Login POC**: Prova de conceito de login com Google OAuth.

## [0.1.1] - 2025-12-10
### 📝 Planning
- **Requirements**: Definição de escopo e funcionalidades MVP.
- **Tech Stack**: Seleção de React, Node, Tailwind.

## [0.1.0] - 2025-12-01
### 🎉 Initial Commit
- **Repository**: Criação do repositório.
- **Hello World**: Setup inicial do ambiente de desenvolvimento.

## [0.0.8] - 2025-11-28
### 🧪 Feasibility Study
- Análise de APIs de email.
- Testes de performance com listas grandes.

## [0.0.7] - 2025-11-25
### 🧠 Ideation
- Brainstorming do conceito "Ratel".
- Definição da persona do usuário.

## [0.0.6] - 2025-11-20
### 📊 Market Analysis
- Estudo de concorrentes (Mailstrom, Cleanfox).
- Identificação de oportunidades de nicho (Gamificação).

## [0.0.5] - 2025-11-15
### 📝 Conceptual Draft
- Rascunhos iniciais de wireframes.

## [0.0.4] - 2025-11-10
### 💡 Inception
- Ideia inicial do projeto surgida.

## [0.0.3] - 2025-11-05
### 🥚 Pre-Alpha Research
- Pesquisa sobre limitações de IMAP/POP3 vs APIs REST.

## [0.0.2] - 2025-11-01
### 🌑 Void
- O caos antes da criação.

## [0.0.1] - 2025-10-25
### 💥 Big Bang
- A singularidade do projeto.
