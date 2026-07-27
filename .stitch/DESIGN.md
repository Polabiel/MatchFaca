# matchFaca — Design System

> "O Tinder da porrada" — encontre oponentes para artes marciais.

## Identidade Visual

### Conceito
matchFaca é brutalista, dark e cinematográfica. A identidade visual bebe de fontes como o universo Fight Club, a estética de MMA underground, e o design dark-first de produtos como Linear e Vercel. A diferença: aqui o sangue é literal.

### Paleta de Cores

| Token | HSL | Uso |
|-------|-----|-----|
| `--background` | `0 0% 4%` | Fundo principal (quase preto) |
| `--foreground` | `0 0% 96%` | Texto principal |
| `--primary` | `0 72% 48%` | Ações, destaques, sangue (#DC2626) |
| `--secondary` | `0 0% 12%` | Cards, superfícies secundárias |
| `--muted` | `0 0% 10%` | Fundos muted |
| `--border` | `0 0% 14%` | Bordas e divisores |
| `--ring` | `0 72% 48%` | Foco e glow |

### Tipografia

- **Display**: Geist Sans (variável) via `geist/font`
- **Mono**: Geist Mono (variável) via `geist/font`
- **Escala**: `text-xs` (12px) → `text-8xl` (96px) via Tailwind
- **Estilo**: Font-weight bold (700+) para headlines, regular (400) para corpo

### Glow & Efeitos

```css
/* Sangue glow para CTAs */
.glow-fire {
  box-shadow: 0 0 24px hsl(0 100% 50% / 0.5),
              0 0 48px hsl(25 100% 50% / 0.3);
}

/* Card overlay gradiente */
.bg-card-overlay {
  background: linear-gradient(to top, hsl(0 0% 4%) 0%, hsl(0 0% 4% / 0.85) 25%, transparent 60%);
}

/* Textura de ruído */
.bg-noise {
  background-image: url("data:image/svg+xml,...");
  opacity: 0.04;
}
```

## Arquitetura de Telas

### Web (Next.js)

```
/ (landing page)           → Hero + Como Funciona + Features + CTA
  ├── /swipe               → Feed de perfis (swipe cards)
  ├── /matches             → Lutas aceitas / pendentes
  ├── /profile             → Perfil do usuário (ficha de lutador)
  └── /onboarding          → Wizard: nickname → estilo → peso
```

### Mobile (Expo)

```
/ (index)                  → AuthScreen | AuthenticatedGate → SwipeFeed
  ├── /swipe               → SwipeFeed + NavBar
  ├── /matches             → Lutas
  ├── /profile             → Perfil
  └── /onboarding          → Wizard mobile
```

### Fluxo de Autenticação

1. Usuário não logado → landing page (web) | AuthScreen (mobile)
2. Login com Discord → callback → /swipe (web) | / (mobile)
3. Verifica se perfil existe:
   - Sim → /swipe (normal)
   - Não → /onboarding
4. Onboarding completo → redireciona para /swipe

## Layout

### Web
- Landing page: full-width, sem NavBar, sem constraints
- App pages: `max-w-lg` mobile-first centralizado com NavBar fixa no fundo
- NavBar (3 abas): 🔥 Swipe | 🤜 Lutas | 👤 Perfil

### Mobile
- SafeAreaView com padding consistente
- NavBar fixa no fundo com border-top
- Dark mode fixo (#0D0D0D)

## Componentes

### Botões
- `Button` do `@matchfaca/ui` com variantes: primary, destructive, outline, secondary, ghost, link
- Landing page CTA: `glow-fire` com shadow e hover scale

### Formulários
- React Hook Form + Zod (via `@matchfaca/ui/form`)
- Perfil: nickname, bio, fightingStyle, weightClass, locationName
- Onboarding: wizard multi-step com validação inline

### Swipe Cards
- Card com foto, nome, estilo, peso, win/loss ratio
- Botões Skip (⬅️) e Challenge (➡️)
- Animações: swipeCardEnter, swipeCardExitLeft, swipeCardExitRight

## Microcopy (PT-BR)

- "Encontros que Escalam" — tagline
- "Crie seu perfil → Encontre oponentes → Marque a luta" — fluxo
- "Entrar com Discord" — CTA principal
- "Sua ficha de lutador" — header do perfil
- "Pular" — skip onboarding
- "Continuar" / "Finalizar" — progressão

## Diretrizes de Tom

- Agressivo mas respeitoso
- Linguagem de ringue: "ficha de lutador", "cartel", "porrada"
- Sem emojis infantis (apenas os temáticos: 🥊, 🗡️, 👊, ⚔️)
- Dark humor sutil ("Encontros que escalam")

## Performance

- Prefetch de dados via tRPC + TanStack Query
- HydrateClient para dados iniciais
- Suspense boundaries em todas as páginas com dados async
- Layouts separados (landing sem NavBar vs app com NavBar) via route groups
