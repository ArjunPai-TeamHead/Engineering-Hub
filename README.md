# EngiNexus — Engineering Intelligence Platform

EngiNexus is an all-in-one learning, prototyping, and collaboration platform for hardware engineers, makers, and students. It combines an interactive electronics simulator, an LMS, an AI engineering assistant, a community chat, a component marketplace, and a full toolbox of engineering calculators — all behind a single account.

**Live website:** https://enginexushub.lovable.app
**Preview (latest build):** https://id-preview--fcca4d74-b8b4-4674-83f5-56b26ec52f87.lovable.app

---

## Table of Contents

1. [What you get](#what-you-get)
2. [Tech stack](#tech-stack)
3. [Repository structure](#repository-structure)
4. [How the code is organized](#how-the-code-is-organized)
5. [Backend (Lovable Cloud)](#backend-lovable-cloud)
6. [Running locally](#running-locally)
7. [Using the live website](#using-the-live-website)
8. [Admin access](#admin-access)
9. [Deployment](#deployment)
10. [Scripts](#scripts)

---

## What you get

| Zone | Route | Purpose |
|------|-------|---------|
| 🏠 Home | `/` | Public landing page with cards into every zone |
| 🔬 The Lab | `/lab` | Component library + virtual breadboard simulator, code editor, serial monitor, GPIO matrix |
| 💬 The Hive | `/hive` | Discord-style realtime community chat with channels, members, voice panel placeholder |
| 🎓 The Academy | `/academy` | Udemy-style LMS — Raspberry Pi, Arduino, OpenCV, PyGame courses with AI photo-graded lessons and certificates |
| 🧠 The Core | `/core` | Streaming AI engineering assistant (errors, code translation, datasheets, project ideas) |
| 🛒 The Depot | `/depot` | Amazon-style component marketplace with cart (`/cart`), checkout, orders, tracking |
| 🔧 The Workshop | `/workshop` | All calculators (Toolbox + Forge): resistor codes, Ohm's law, 555 timer, wire gauge, heatsinks, etc. |
| 🔗 The Hub | `/hub` | Quick-jump dashboard linking every zone |
| ☁️ Cloud Database | `/cloud-database` | Personal file/snippet storage |
| 🏆 Certificates | `/certificates` | Earned course certificates |
| ⚙️ Settings | `/settings` | Profile, theme, jobs board |
| 🛡️ Admin | `/admin` | Admin-only — users, moderation, sensitive-data PIN gate, course progress |

Design language: glassy iOS-26 style, fully rounded corners, green-glass primary / black-glass disabled, no spinner animations.

---

## Tech stack

- **Frontend:** React 18 + TypeScript + Vite 5
- **Styling:** Tailwind CSS v3 + shadcn/ui (semantic HSL design tokens in `src/index.css` and `tailwind.config.ts`)
- **Routing:** React Router v6 with `ProtectedRoute` / `AdminRoute` gates
- **State:** React hooks + `@tanstack/react-query` + lightweight custom hooks (e.g. `useCart`, `useAuth`)
- **Backend:** Lovable Cloud (managed Supabase) — Postgres, Auth, Storage, Edge Functions
- **AI:** Lovable AI Gateway (Gemini + GPT models) — no API keys required for users
- **Realtime:** Supabase Realtime (Hive chat)
- **Editor:** Monaco (`@monaco-editor/react`) inside The Lab
- **Tests:** Vitest

---

## Repository structure

```
.
├── public/                  # Static assets, _redirects (SPA fallback), _headers, robots.txt
├── src/
│   ├── App.tsx              # Top-level router; wires every page + auth/admin guards
│   ├── main.tsx             # React entry
│   ├── index.css            # Design tokens (HSL), glassmorphism utilities, theme variables
│   ├── components/          # Reusable UI
│   │   ├── AppLayout.tsx    # Sidebar + content shell for authenticated zones
│   │   ├── AppSidebar.tsx   # Collapsible nav with theme toggle, settings, sign-out
│   │   ├── ProtectedRoute   # Redirects to /sign-in if not authenticated
│   │   ├── AdminRoute       # Requires the "admin" role from user_roles
│   │   ├── auth/            # AuthForm, providers grid, password strength, animations
│   │   ├── depot/           # CheckoutModal (Luhn-validated cards, UPI, COD, Akiko bank verify)
│   │   ├── hive/            # ChannelSidebar, MessageArea, MemberList, VoicePanel
│   │   ├── lab/             # Breadboard, ComponentPalette, CodeEditor, SerialMonitor, GPIOMatrix
│   │   └── landing/ZoneCard
│   ├── pages/               # One file per route
│   │   ├── Index.tsx        # Public landing
│   │   ├── SignIn / SignUp / Auth / ResetPassword
│   │   ├── Lab, Hive, Academy, Core, Depot, Cart, OrderPlaced
│   │   ├── Workshop (+ toolbox/* and forge/* sub-pages for each calculator)
│   │   ├── academy/CoursePage, academy/LessonPage
│   │   ├── settings/Jobs, settings/JobDetail
│   │   └── AdminDashboard
│   ├── hooks/               # useAuth, useCart, use-mobile, use-toast
│   ├── data/                # componentLibrary.ts, courses.ts (static catalog)
│   ├── integrations/
│   │   ├── supabase/        # client.ts + types.ts (AUTO-GENERATED — never edit)
│   │   └── lovable/         # Lovable Cloud helper exports
│   └── test/                # Vitest setup + examples
├── supabase/
│   ├── config.toml          # Project config + per-edge-function settings
│   └── functions/           # Deno edge functions (deploy automatically)
│       ├── core-ai/         # Streaming AI assistant (The Core)
│       ├── academy-ai/      # Lesson AI helper
│       ├── academy-grade/   # AI photo grading for lesson submissions
│       ├── admin-sensitive/ # PIN-gated PII/order reveal
│       ├── bootstrap-admin/ # One-shot admin account creation
│       ├── create-admin/    # Promote a user to admin role
│       ├── create-depot-checkout/  # Server-priced cart → order
│       └── resolve-username/
├── netlify.toml             # Hosting config (also works on Lovable hosting)
├── tailwind.config.ts       # Theme tokens, animations, container
├── vite.config.ts           # Vite + SWC + path alias `@` → `src/`
└── package.json
```

---

## How the code is organized

**Routing & guards.** `src/App.tsx` defines every route. Authenticated zones are wrapped in `<ProtectedRoute>` (redirects to `/sign-in` when no session) and the admin page in `<AdminRoute>` (requires `admin` row in `public.user_roles`).

**Auth.** `src/hooks/useAuth.tsx` subscribes to Supabase auth state and exposes `user`, `session`, `signIn`, `signUp`, `signOut`. Sign-in/sign-up live at `/sign-in` and `/sign-up`. Email verification is enabled; Google OAuth is wired through Lovable Cloud.

**Design system.** All colors are HSL tokens in `src/index.css` (`--primary`, `--background`, glass utilities, etc.) and surfaced through `tailwind.config.ts`. Components use semantic classes (`bg-primary`, `text-foreground`) — never raw `bg-white`/`text-black`.

**Data layer.** Reads/writes go through `@/integrations/supabase/client`. Generated types live in `src/integrations/supabase/types.ts` and reflect the live schema. Row-Level Security policies enforce per-user access; roles are stored in a separate `user_roles` table and checked via the `has_role()` security-definer function.

**Edge functions.** Anything that needs a server secret (AI calls, admin reveals, server-priced checkout) runs in `supabase/functions/*`. They are auto-deployed on save.

**Cart.** `src/hooks/useCart.tsx` is a localStorage-backed hook with a `cart-updated` `CustomEvent` so the Depot tab badge and `/cart` page stay in sync. Checkout (`src/components/depot/CheckoutModal.tsx`) validates card numbers with the Luhn (mod-10) algorithm and supports UPI, COD, and bank transfer with Akiko-style verification.

**AI helpers.** Both The Core and Academy lesson helpers stream from Lovable AI via edge functions; output is sanitized with DOMPurify before render.

---

## Backend (Lovable Cloud)

Lovable Cloud auto-provisions a Supabase project; you do not need a Supabase account. The frontend reads its connection from `.env` (auto-generated, do **not** edit):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

Server secrets (AI keys, admin PIN, etc.) are managed through the Lovable secrets panel and read inside edge functions via `Deno.env.get(...)`.

---

## Running locally

Prerequisites: **Node 18+** and **npm** (or **bun**).

```bash
# 1. Clone
git clone <YOUR_REPO_URL>
cd <REPO_FOLDER>

# 2. Install dependencies
npm install        # or: bun install

# 3. Pull the auto-generated env file
#    Open the project on lovable.dev → ⋯ menu → "Download .env"
#    and place it at the repo root. It contains the VITE_SUPABASE_* values.

# 4. Start the dev server (Vite, port 8080)
npm run dev

# 5. Open the app
#    http://localhost:8080
```

Notes:

- The dev server proxies the live Lovable Cloud backend, so auth, database, AI, and edge functions all work locally exactly as in production.
- Edge functions are deployed by Lovable automatically when you push changes through the Lovable editor; you do not run them locally.
- Tests: `npm run test` (Vitest). Lint: `npm run lint`.

---

## Using the live website

1. Visit **https://enginexushub.lovable.app**.
2. The landing page (`/`) is public — click any zone card or **Sign in / Sign up** in the top-right.
3. Create an account with email + password (verify the email) or use Google.
4. After sign-in you land on the Hub. From the left sidebar pick a zone:
   - **Academy** → enroll in a course → open a lesson → submit photo evidence → AI grades it → progress saved → certificate issued at 100 %.
   - **Lab** → drag components onto the breadboard, write code in Monaco, watch the serial monitor.
   - **Hive** → pick a channel and chat in real time.
   - **Depot** → add components to cart → `/cart` → checkout (card with Luhn validation, UPI, COD, or bank/Akiko) → `/order-placed` → track in Settings → Jobs.
   - **Core** → ask any engineering question; replies stream live.
   - **Workshop** → use any calculator under Toolbox or Forge.
5. Toggle dark/light mode and manage your profile from the sidebar footer / **Settings**.

The site is a single-page app — refreshing any deep link works thanks to `public/_redirects` and Lovable's SPA fallback.

---

## Admin access

The admin dashboard is at `/admin` and is gated by the `admin` role.

- **Email:** `admin@enginexus.com`
- **Password:** set via the `bootstrap-admin` edge function on first run (the `ADMIN_SENSITIVE_PIN` secret seeds it).

From `/admin` you can browse users, view per-user course progress, suspend/ban accounts, and unlock sensitive PII via a PIN-gated panel that calls the `admin-sensitive` edge function.

---

## Deployment

The project is hosted on Lovable hosting (and works on Netlify via `netlify.toml`).

- **Frontend changes** go live when you click **Publish → Update** in the Lovable editor.
- **Backend changes** (edge functions, migrations) deploy **immediately and automatically** on save.
- Custom domains can be attached from **Project Settings → Domains** after the first publish.

---

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server on `http://localhost:8080` |
| `npm run build` | Production build into `dist/` |
| `npm run build:dev` | Development-mode build (source maps, no minify) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint over the whole project |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest in watch mode |

---

## Contributing / editing

You can edit the project two ways:

1. **In Lovable** (recommended) — open the project, chat with the AI, every change is committed to the repo automatically.
2. **Locally** — clone, edit, push. Changes pulled into Lovable will appear in the editor.

Never hand-edit:
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `.env`

These are regenerated by Lovable Cloud.
