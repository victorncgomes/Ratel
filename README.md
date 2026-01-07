<div align="center">
<img src="public/name-ratel.svg" alt="Ratel Logo" width="300" />

# Ratel — Inbox Control Center

**Gerenciador inteligente de caixa de entrada com IA**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://ratel-five.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.2.7-green.svg)](CHANGELOG.md)

[Demo](https://ratel-five.vercel.app) · [Documentação](docs/ARCHITECTURE.md) · [Changelog](CHANGELOG.md)

</div>

---

## 🚀 Features

### 🤖 Sistema RATE (IA)
Pontuação inteligente 0-100 para cada email baseada em comportamento do usuário, usando Google Gemini API.

### 📊 Visualizações Inteligentes
- **Por Remetente**: Agrupa emails por remetente
- **Por Tamanho**: Identifica emails grandes (>5MB)
- **Por Data**: Organiza por períodos (Ontem, Esta semana, Meses)
- **Newsletters**: Detecção automática de inscrições
- **Promoções**: Filtra emails promocionais

### 🧹 Limpeza Automática
- Emails antigos (>6 meses)
- Não lidos antigos (>30 dias)
- Anexos grandes
- Rascunhos antigos
- Esvaziar spam e lixeira

### 🛡️ Shield & Rollup
- **Shield**: Bloqueia remetentes automaticamente
- **Rollup**: Agrupa newsletters em resumo diário

### 🎨 Design Moderno
- Tema NOIR (Dark Mode) com glassmorphism
- Tema Aurora (Light Mode) com gradientes
- Interface responsiva e acessível
- Virtualização de listas para performance

### 🌍 Multilíngue
Suporte para Português, Espanhol e Inglês.

---

## 🛠️ Tecnologias

### Frontend
- **React 19** + **TypeScript 5.8**
- **Vite 6** (build tool)
- **Tailwind CSS 3.4**
- **Radix UI** (componentes)
- **Recharts** (gráficos)
- **Google Gemini API** (IA)

### Backend
- **Node.js** + **Express**
- **Gmail API** (googleapis)
- **Microsoft Graph API**
- **Passport.js** (OAuth 2.0)

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- Conta Google Cloud (para Gmail API)
- Conta Azure (para Microsoft Graph API)

### 1. Clone o repositório
```bash
git clone https://github.com/victorncgomes/Ratel.git
cd Ratel
```

### 2. Instale dependências

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 3. Configure variáveis de ambiente

**Frontend** (`.env.local`):
```env
GEMINI_API_KEY=your_gemini_api_key
```

**Backend** (`server/.env`):
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
SESSION_SECRET=your_random_secret
FRONTEND_URL=http://localhost:3009
PORT=3109
```

### 4. Execute a aplicação

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
```

Acesse: **http://localhost:3009**

---

## 📁 Estrutura do Projeto

```
Ratel/
├── src/                    # Frontend React
│   ├── components/        # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilitários e i18n
│   └── services/          # Serviços frontend
├── server/                 # Backend Node.js
│   ├── auth/              # OAuth strategies
│   ├── services/          # Lógica de negócio
│   └── server.js          # Express server
├── docs/                   # Documentação
│   ├── ARCHITECTURE.md    # Arquitetura detalhada
│   ├── changelog.md       # Histórico de versões
│   └── dialogs.md         # Decisões de design
└── public/                 # Assets estáticos
```

Veja [ARCHITECTURE.md](docs/ARCHITECTURE.md) para detalhes completos.

---

## 🎯 Modo Demo

Experimente o Ratel sem fazer login! O modo demo utiliza dados simulados para demonstrar todas as funcionalidades.

---

## 📖 Documentação

- [Arquitetura](docs/ARCHITECTURE.md) - Estrutura técnica completa
- [Changelog](CHANGELOG.md) - Histórico de versões
- [Decisões de Design](docs/dialogs.md) - Registro de decisões

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Victor Gomes**

- GitHub: [@victorncgomes](https://github.com/victorncgomes)
- Deploy: [ratel-five.vercel.app](https://ratel-five.vercel.app)

---

## 🙏 Agradecimentos

- [Google Gemini](https://ai.google.dev/) - IA para sistema RATE
- [Gmail API](https://developers.google.com/gmail/api) - Integração com Gmail
- [Microsoft Graph](https://developer.microsoft.com/graph) - Integração com Outlook
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

</div>

