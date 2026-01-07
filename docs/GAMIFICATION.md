# Sistema de Gamificação - Ratel v0.2.9

> Transformando limpeza de email em uma BATALHA ÉPICA!

## 🎮 Visão Geral

O Ratel implementa um sistema de gamificação inspirado no Duolingo e Super Mario Bros SNES, com:

- **Design System Neobrutalist** - Bordas pretas, sombras duras, sem arredondamentos
- **Sistema de Badges** - 15 conquistas em 3 tiers (Bronze/Silver/Gold)
- **Progressão por Territórios** - 4 mapas com requisitos e recompensas
- **Economia de Créditos** - Modelo freemium com limites diários
- **Frases Engraçadas** - 80+ mensagens trilíngue durante carregamento

---

## 📁 Estrutura de Arquivos

```
src/
├── styles/
│   └── neobrutalism.css          # Design System completo
│
├── lib/gamification/
│   ├── index.ts                   # Barrel exports
│   ├── funnyMessages.ts           # 80+ frases PT/EN/ES
│   ├── badges.ts                  # 15 badges trilíngue
│   ├── territories.ts             # 4 territórios
│   └── credits.ts                 # Economia freemium
│
├── hooks/
│   ├── useProgression.ts          # Gerencia streaks, territórios
│   ├── useBadges.ts               # Desbloqueio automático
│   └── useCredits.ts              # Economia e limites
│
└── components/gamification/
    ├── index.tsx                  # Barrel exports
    ├── MapView.tsx                # Mapa principal (substitui Dashboard)
    ├── TerritoryNode.tsx          # Nó do mapa
    ├── BadgeGallery.tsx           # Galeria de badges
    ├── CreditsDisplay.tsx         # Créditos e streak
    └── LoadingScreen.tsx          # Carregamento com frases
```

---

## 🎨 Design System Neobrutalist

### Variáveis CSS
```css
--brutal-white: #FFFFFF;
--brutal-black: #000000;
--brutal-ice: #F5F5F5;
--brutal-red: #E63946;
```

### Classes Principais
| Classe | Uso |
|--------|-----|
| `.brutal-card` | Card com borda preta e sombra offset |
| `.brutal-button` | Botão com efeito press |
| `.brutal-badge` | Badge circular com tier |
| `.brutal-progress` | Barra de progresso |
| `.brutal-territory` | Nó do mapa |

---

## 🏅 Sistema de Badges

### Tiers
- **Bronze** 🥉 - Iniciante (1-50 ações)
- **Silver** 🥈 - Intermediário (50-500 ações)
- **Gold** 🥇 - Avançado (500+ ações)

### Badges Disponíveis
| Nome | Tier | Requisito | Créditos |
|------|------|-----------|----------|
| First Blood | Bronze | 1 email | +10 |
| Honey Badger | Bronze | 10 emails | +50 |
| Spam Slayer | Silver | 50 spam | +100 |
| Newsletter Destroyer | Silver | 50 unsubs | +200 |
| Inbox Zero Hero | Gold | 1 inbox zero | +500 |
| Email Annihilator | Gold | 1000 emails | +1000 |

---

## 🗺️ Territórios

| # | Nome | Requisitos | Recompensa |
|---|------|------------|------------|
| 1 | Floresta do Spam | 100 emails, 10 unsubs | +50 💰 |
| 2 | Montanha das Newsletters | 500 emails, 50 unsubs | +200 💰 |
| 3 | Deserto Corporativo | 1000 emails, 100 unsubs | +500 💰 |
| 4 | Infinito e Além | ∞ | - |

---

## 💰 Sistema de Créditos

### Limites FREE
- 10 exclusões/dia
- 5 unsubscribes/dia
- 100 créditos iniciais

### Ganhos
- +2 por email deletado
- +5 por unsubscribe
- +50 por badge desbloqueado
- +200 por território completado

### PRO (Futuro)
- R$ 29,90/mês
- R$ 299/ano
- Ações ilimitadas

---

## 😂 Frases Engraçadas

Categorias:
- **Política** - "Analisando se você vota em Lula ou Bolsonaro..."
- **Stalker** - "Vi que você compra muito na Amazon às 2h..."
- **Absurdo** - "Penteando o cabelo dos seus dados..."
- **Tech/Nerd** - "Rodando sudo rm -rf no seu spam..."
- **Autoironia IA** - "Skynet está offline, pode relaxar..."

**Meta**: Expandir de 80 para 200 frases.

---

## 🚀 Uso

### MapView (substitui Dashboard)
```tsx
import { MapView } from '@/components/gamification';

function App() {
  return <MapView />;
}
```

### LoadingScreen
```tsx
import { LoadingScreen } from '@/components/gamification';

<LoadingScreen
  progress={50}
  emailsLoaded={5000}
  totalEmails={10000}
  isVisible={true}
  onComplete={() => console.log('Done!')}
/>
```

### Hooks
```tsx
import { useProgression, useBadges, useCredits } from '@/hooks';

function Component() {
  const { userProgress, incrementStat } = useProgression();
  const { unlockedBadges, getAllBadgesWithProgress } = useBadges();
  const { credits, performAction, checkCanPerformAction } = useCredits();
}
```

---

## 📋 Próximos Passos (v0.3.0+)

- [ ] Geração de assets visuais (Ratel, inimigos, cenários)
- [ ] Integração de pagamentos (Stripe, PIX, PayPal)
- [ ] Leaderboards globais
- [ ] Backend PostgreSQL
- [ ] Expandir frases para 200
