# matchFaca — Encontros que Escalam

> O Tinder da porrada. Encontre oponentes, marque brigas, resolva no soco.

matchFaca é um aplicativo que conecta lutadores próximos para desafios mano a mano. Pense Tinder, mas com luvas de boxe.

## Stack

- **Web:** Next.js 15 (App Router) + Tailwind CSS + tRPC v11
- **Mobile:** Expo SDK 53 (React Native 19) + NativeWind + Expo Router
- **Backend:** tRPC v11 (API server via Next.js), Drizzle ORM
- **Database:** PostgreSQL 16 + PostGIS (via Docker)
- **Auth:** NextAuth v5 (Auth.js) with Discord OAuth
- **Infra:** Docker Compose, Turborepo, pnpm workspaces

## Arquitetura

```
matchfaca/
├── apps/
│   ├── nextjs/       # Web app (Next.js 15)
│   ├── expo/         # Mobile app (React Native / Expo)
│   └── auth-proxy/   # Proxy OAuth (Nitro server)
├── packages/
│   ├── api/          # tRPC routers (profile, fight-request, fight)
│   ├── auth/         # NextAuth v5 config
│   ├── db/           # Drizzle schema + migrations
│   └── ui/           # shadcn/ui components
└── tooling/          # ESLint, Prettier, TypeScript, Tailwind configs
```

## Começando

### Pré-requisitos

- Node.js >= 22.14 (veja `.nvmrc`)
- pnpm 10+
- Docker (para PostgreSQL local)
- Discord OAuth credentials (para login)

### Setup

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com seu AUTH_DISCORD_ID e AUTH_DISCORD_SECRET

# 3. Subir PostgreSQL
docker compose up -d postgres

# 4. Aplicar schema do banco
pnpm --filter @matchfaca/db push

# 5. Rodar dev
pnpm dev
```

### Desenvolvimento

- **Web:** http://localhost:3000 (Next.js)
- **Auth Proxy:** http://localhost:3001 (necessário apenas para Expo OAuth)

### Comandos

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia web + auth proxy em dev |
| `pnpm build` | Build de produção |
| `pnpm typecheck` | TypeScript check em todos os pacotes |
| `pnpm lint` | ESLint em todos os pacotes |
| `pnpm format` | Prettier check |
| `pnpm --filter @matchfaca/db push` | Push schema para o banco |
| `pnpm --filter @matchfaca/db studio` | Drizzle Studio |
| `pnpm ui-add` | Adicionar componente shadcn/ui |

## Funcionalidades

### Swipe (Deslizar)
Perfis de lutadores próximos com foto, estilo de luta, peso e histórico. Deslize para pular ou desafiar.

### Match (Luta)
Quando alguém aceita seu desafio, vira uma luta. Agende data, local e prepare-se.

### Perfil de Lutador
Nickname, estilo de luta, classe de peso, bio. Cada vitória e derrota fica registrada.

## Docker

```bash
# Subir tudo (Postgres + Next.js + Auth Proxy)
docker compose up -d

# Apenas o banco
docker compose up -d postgres

# Logs
docker compose logs -f

# Parar
docker compose down
```

O PostgreSQL roda na porta 5434 com as credenciais:
- User: `matchfaca`
- Password: `matchfaca_dev`
- Database: `matchfaca`

## CI/CD

GitHub Actions roda lint, format, typecheck e build em cada PR/push na main.

## License

MIT
