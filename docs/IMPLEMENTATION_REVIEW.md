# Daily — Implementation Review

> **Data:** 2026-05-26  
> **Branch:** `main` (de7360f)  
> **Fases concluídas:** 1 → 7 + design refresh (Phase 8 label do commit)  
> **Status:** Pronto para closed beta

-----

## 1. O que foi construído

### 1.1 Stack completo

| Camada | Escolha |
|---|---|
| Framework | Next.js 16.2.6 (App Router, RSC) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS v4 com `@theme` (design tokens como CSS vars) |
| Estado cliente | Zustand v5 (draft de criação); TanStack Query v5 (server state) |
| Formulários | react-hook-form + Zod |
| Banco local | Dexie v4 (IndexedDB) — instalado, ainda não integrado ao sync |
| Backend | Supabase (Postgres + Auth + Edge Functions) |
| Push | Web Push via VAPID + `web-push` npm no Deno runtime |
| PWA | Serwist (sucessor do next-pwa) |
| Linting | Biome 1.9.4 (lint + format) |
| Commits | Conventional Commits + Husky + lint-staged |
| CI | GitHub Actions + Vercel (preview por PR) |

---

## 2. Features implementadas

### 2.1 Autenticação e onboarding (Phase 2)

**Fluxo completo de 7 telas:**

| Rota | Tela | O que faz |
|---|---|---|
| `/welcome` | S1 | Apresentação do app; botões Sign up / Sign in |
| `/signup` | S2 | Email + senha; validação Zod; trata email já cadastrado e confirmação pendente |
| `/name` | S3 | Display name + timezone (detectado via `Intl.DateTimeFormat`) |
| `/time` | S4 | Horário padrão de lembrete com `TimeWheelPicker` (scroll nativo iOS-like) |
| `/notifications` | S5 | Soft ask + `requestAndSubscribe()` — apenas depois de interação explícita |
| `/done` | S6 | Seta `onboarding_completed = true` em `user_preferences` |
| `/login` | — | Sign in email + senha + Google OAuth (social login adicionado após Phase 2) |
| `/forgot-password` | — | Placeholder; redireciona para `/login` |

**Proxy (auth guard — `proxy.ts`):**
- Usuário não autenticado → redireciona para `/welcome`
- Usuário autenticado com `onboarding_completed = false` → redireciona para `/name`
- Usuário autenticado e onboarding completo → acesso livre ao `(app)`

**Decisão:** o arquivo era `middleware.ts`; migrado para `proxy.ts` + `export function proxy` no Next.js 16.

---

### 2.2 Reminders — CRUD completo (Phase 3)

**Fluxo de criação (8 telas):**

| Rota | Tela | Estado Zustand |
|---|---|---|
| `/reminders/new` | CR1 — Título e tipo | `title`, `reminderType` |
| `/reminders/new/when` | CR2 — Data e hora | `eventDate`, `eventTime` |
| `/reminders/new/schedule` | CR3 — Schedule presets | `scheduleKind`, `preset` |
| `/reminders/new/custom-days` | CR3b — Dias personalizados | `customOffsets[].days` |
| `/reminders/new/custom-times` | CR3c — Horários por dia | `customOffsets[].time` |
| `/reminders/new/message` | CR4 — Mensagem | `message` |
| `/reminders/new/review` | CR5 — Revisão | lê todo o draft |
| `/reminders/new/created` | CR6 — Confirmação | chama `reset()` |

**Estado cross-tela:** `useReminderDraft` (Zustand + `persist` → `localStorage` key `daily.reminder-draft`). O draft sobrevive a reload e back/forward — `reset()` só é chamado na tela Created ou no botão Cancel do `FlowHeader`.

**Schema Zod (`lib/reminders/schema.ts`):**
- Tipos: `meeting | event | deadline | task`
- Schedule: `discriminatedUnion` → `preset` (`on_day | day_before | three_days | week_before`) ou `custom` (array de `{ days: 0–60, time: HH:MM }`)
- `event_date`: ISO com offset — o cliente converte wall-clock → UTC antes de enviar

**Server Actions (`lib/reminders/actions.ts`):**
- `createReminder` → insert + `revalidatePath("/today", "/all")`
- `updateReminder` → update + revalida reminder detail
- `deleteReminderAction` / `markReminderDoneAction` → delete (ambas deletam o registro — "mark done" é equivalente a deletar no MVP) + redirect `/today`

**Tela de detalhe (`/reminders/[id]`):**
- Card hero com gradiente azul + tipo + título + countdown
- Timeline de "upcoming pings" com dots coloridos (notificação = azul, evento = laranja, mudo = track)
- Ações: Delete e Mark as done (ambas via Server Action com `<form>`)
- Link para edição via dots icon

**Tela de edição (`/reminders/[id]/edit`):**
- `EditReminderForm` (client component) com react-hook-form + Zod
- Salva via `updateReminder` server action
- Revalida o detail e as listas

---

### 2.3 Routines — CRUD completo (Phase 4)

**Fluxo de criação (5 telas):**

| Rota | Tela | Estado Zustand |
|---|---|---|
| `/routines/new` | RT1 — Pick tipo | `routineType`, `title` |
| `/routines/new/days` | RT2 — Dias da semana | `daysOfWeek` (0=Dom…6=Sáb) |
| `/routines/new/times` | RT3 — Horários | `timesOfDay` (HH:MM[]) |
| `/routines/new/goal` | RT4 — Meta semanal (opcional) | `goalPerWeek` |
| `/routines/new/created` | RT5 — Confirmação | reset |

**Tipos preset:** `drink_water | stretch | read | walk | meditate | custom`  
Cada tipo tem label, emoji/icon, tint de background e cor de ícone definidos em `lib/routines/schema.ts`.

**Tela de detalhe (`/routines/[id]`):**
- Circular arc de progresso SVG (strokeDasharray)
- Dots semanais (M-D) com estados: futuro / agendado-mas-perdido / hoje-parcial / completo
- Stats mini-cards: Streak (dias) + This week (%)
- `LogSessionButton` — client component que chama server action de upsert em `routine_logs`
- Ação Pause → `active = false`

**Tela de edição (`/routines/[id]/edit`):**
- `EditRoutineForm` com react-hook-form
- Edita título, dias, horários e meta

**Schema de armazenamento:**
- `days_of_week: INTEGER[]` — convenção 0=Sunday (padrão JS `getDay()`)
- `times_of_day: TIME[]` — Postgres pode retornar com segundos (`HH:MM:SS`); o schema Zod normaliza para `HH:MM` via `.transform(t => t.slice(0,5))`

---

### 2.4 Home — 4 tabs (Phase 5)

**Layout:** `app/(app)/layout.tsx` → `<BottomNav />` + `<FabWithSheet />`

| Tab | Rota | Conteúdo |
|---|---|---|
| Today | `/today` | Greeting contextual (Morning/Afternoon/Evening) + streak chip + routines do dia + próximos reminders (limit 5) |
| All | `/all` | Filter pills (Upcoming / Routines / Done) + listas separadas |
| Stats | `/stats` | Streak geral + heatmap 365d + completion % 7d/30d + monthly breakdown |
| You | `/you` | Profile card + settings rows (tema, horário, timezone) + quiet hours switch + logout |

**BottomNav:** `usePathname()` para ícones filled/outline; oculto fora das 4 tab routes.

**FabWithSheet:** aparece nas 4 tabs via layout; abre card flutuante acima do tab bar com opções "New reminder" e "New routine"; ícone "+" roda 45° para "×"; backdrop fecha ao clicar fora.

**Today — loading skeleton:** `loading.tsx` com blocos animados (`animate-pulse`) enquanto os dados do servidor carregam.

**Streak:** calculado no servidor, varredura 60d regressiva. Ignora o dia de hoje se não houve log ainda (i=0 com miss não quebra o streak).

---

### 2.5 Push notifications (Phase 6)

**Fluxo end-to-end:**

```
Usuário cria reminder
       ↓
INSERT reminders (Supabase)
       ↓
Postgres trigger (trg_reminders_refresh_notifications)
       ↓
generate_reminder_notifications() → INSERT scheduled_notifications
       ↓
dispatch_push Edge Function (cron ~1min)
       ↓
claim_pending_notifications() → FOR UPDATE SKIP LOCKED
       ↓
web-push → APNs / FCM
       ↓
Service Worker (push event) → showNotification()
       ↓
notificationclick → focus/navigate para /reminders/:id
```

**Para routines:**
```
rotate_routines Edge Function (cron diário, 00:05 UTC)
  → para cada rotina ativa, verifica DayOfWeek de amanhã no tz da rotina
  → INSERT scheduled_notifications ON CONFLICT DO NOTHING (idempotente)
  → mesmo dispatch_push drena a fila
```

**Subscrição (`lib/push/subscribe.ts`):**
- `requestAndSubscribe()` — nunca lança exceção; retorna `{ permission, subscribed, subscriptionError? }`
- Upsert em `push_subscriptions` por `endpoint` (unicidade por device)
- Expired subscriptions (404/410) são deletadas automaticamente pelo `dispatch_push`

**claim_pending_notifications (migration 0005):**
- `FOR UPDATE SKIP LOCKED` → invocações concorrentes do cron nunca pegam a mesma linha
- Retorna as colunas necessárias para dispatch sem segundo SELECT

**Service Worker (`app/sw.ts`, Serwist):**
- `push` event: parse JSON do payload; `showNotification` com icon e badge
- `notificationclick`: fecha notificação; prefere focar janela existente; abre nova aba como fallback
- `skipWaiting + clientsClaim` para ativação imediata

**`InstallPromptCapture`:** captura `beforeinstallprompt` no root layout antes do evento ser consumido. Guardado em `lib/install/prompt.ts` (módulo singleton).

---

### 2.6 Install screen + polish (Phase 7)

- `/install` — detecta plataforma (iOS Safari vs outros) e mostra instruções específicas
- `app/error.tsx` — error boundary global com botão "Try again"
- `app/not-found.tsx` — página 404
- `QuietHoursSwitch` — toggle client component para ativar/desativar notificações em horário silencioso (persiste em `user_preferences`)
- Loading skeleton para Today

---

### 2.7 Design refresh (Phase 8 — nome do commit)

Redesign completo de todas as telas do `(app)` para um sistema visual unificado:
- **Cards com gradiente hero** nas telas de detalhe (reminder: azul; routine: glassFill com borda azul)
- **Streak chip** laranja na tela Today
- **Circular arc SVG** de progresso na routine detail
- **TypeChips** coloridos na criação de reminders
- **Ícones inline SVG** em todos os componentes (sem dependência de lucide-react nas telas principais)
- **RoutineCheckButton** com cores por tipo de rotina
- **Gradient FAB** com sombra colorida

---

## 3. Decisões de design e arquitetura

### D1 — Draft state em Zustand + localStorage, não em URL params

**Contexto:** o fluxo de criação tem 8 telas (reminders) / 5 telas (routines). A alternativa era guardar estado em query params ou em Server Actions de sessão.

**Decisão:** Zustand com `persist` middleware → `localStorage`.

**Por quê:**
- Back/forward funciona sem perda de estado
- Reload na metade do fluxo não perde o que o usuário digitou
- O draft é isolado por tipo — `daily.reminder-draft` e `daily.routine-draft` — então os dois fluxos nunca colidem
- Limpo explicitamente: `reset()` é chamado apenas na tela de sucesso ou no botão Cancel

**Trade-off:** o estado persiste entre sessões (se o usuário fechar o app no meio do fluxo e voltar dias depois, encontra o draft). Aceitável para MVP.

---

### D2 — schedule_config como JSONB, não colunas relacionais

**Contexto:** o schedule de um reminder pode ser preset (`on_day`) ou custom (array de `{days, time}`). A alternativa era duas tabelas: `reminder_presets` e `reminder_custom_offsets`.

**Decisão:** coluna `schedule_config JSONB` + coluna `schedule_type TEXT` discriminando o shape.

**Por quê:**
- Evita JOIN em toda leitura de reminder
- O shape pode evoluir sem migration (e.g. adicionar `week_before` ou novos presets)
- O Zod schema valida o shape em runtime antes de salvar

**Trade-off:** não há constraint de banco garantindo o shape correto — a validação é responsabilidade da aplicação. Para MVP com um único dev isso é aceitável.

---

### D3 — Postgres trigger para scheduled_notifications de reminders

**Contexto:** quando um reminder é criado ou editado, as notificações agendadas precisam ser recalculadas. A alternativa era fazer isso na Server Action.

**Decisão:** trigger `AFTER INSERT OR UPDATE` em `reminders` chama `generate_reminder_notifications()` e `DELETE`s os `pending` anteriores.

**Por quê:**
- A criação de notificações fica atômica com o INSERT/UPDATE (mesma transação)
- Funciona mesmo se o cliente chegar pelo Supabase Studio ou outro cliente (não depende da Server Action)
- Elimina um round-trip cliente → servidor para notificações

**Trade-off:** lógica de negócio no banco → mais difícil de testar localmente sem Supabase. As funções foram marcadas `SECURITY DEFINER` para contornar RLS durante o cálculo.

---

### D4 — FOR UPDATE SKIP LOCKED no dispatch_push

**Contexto:** o `dispatch_push` é chamado a cada 60s. Se dois invocações overlappam (e.g. cron atrasado), o mesmo push poderia ser enviado duas vezes.

**Decisão:** `claim_pending_notifications()` SQL function que faz `UPDATE ... SET status='processing' WHERE id IN (SELECT ... FOR UPDATE SKIP LOCKED)` e retorna as linhas como resultado.

**Por quê:**
- Transação atômica: claim e retorno são a mesma operação
- `SKIP LOCKED` garante que invocações paralelas peguem conjuntos disjuntos
- Não requer Redis, filas externas ou locks de aplicação

**Trade-off:** se o Edge Function crasha após o claim mas antes do update final, a linha fica em `'processing'` para sempre. Para MVP com poucos usuários e notificações de baixo volume isso é aceitável. Mitigação futura: job de cleanup que reverte `processing → pending` após N minutos.

---

### D5 — rotate_routines idempotente com ON CONFLICT DO NOTHING

**Contexto:** o cron de rotinas gera notificações para o dia seguinte. Se rodar duas vezes (e.g. por retry), não deve duplicar notificações.

**Decisão:** INSERT com `ON CONFLICT (source_type, source_id, send_at) DO NOTHING` (constraint adicionada em migration 0004).

**Por quê:**
- Re-rodar para o mesmo dia é seguro — segunda invocação é no-op
- Simplifica o código do Edge Function (sem SELECT antes do INSERT)
- Permite backfill manual sem risco de duplicatas

---

### D6 — Server Actions para mutações, não API Routes

**Contexto:** Next.js 15+ oferece Server Actions como alternativa a Route Handlers para mutações de formulários.

**Decisão:** todas as mutações (criar, editar, deletar reminder/routine; auth; log de rotina) usam `"use server"` actions.

**Por quê:**
- Sem código de fetch no cliente para mutações simples
- `revalidatePath` integrado — a invalidação de cache é co-localizada com a mutação
- Server Actions com `<form action={...}>` funcionam sem JavaScript (progressive enhancement)
- Retornam tipos `ActionResult<T>` que os clientes podem discriminar (`{ ok: true, data }` vs `{ ok: false, error }`)

**Trade-off:** as actions que retornam dados (e.g. `createReminder`) precisam de um client component wrapper se o redirecionamento depende do ID retornado. O fluxo de reminders resolve isso guardando o ID no Zustand draft após o submit.

---

### D7 — RLS com política única "own rows" por tabela

**Contexto:** cada tabela tem dados de múltiplos usuários.

**Decisão:** uma única policy `FOR ALL` com `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)` por tabela.

**Por quê:**
- Simples e completa — cobre SELECT, INSERT, UPDATE e DELETE em um bloco
- O cliente Supabase anon nunca vê dados de outro usuário mesmo que a query não filtre por `user_id`
- `scheduled_notifications` tem política separada: clientes só leem; apenas o service role escreve (via Edge Function)

---

### D8 — Timezone user-owned, armazenado em user_preferences e em cada reminder/routine

**Contexto:** notificações precisam disparar no horário certo mesmo se o usuário viajar.

**Decisão:** o timezone IANA é capturado durante o onboarding (`Intl.DateTimeFormat().resolvedOptions().timeZone`) e armazenado em `user_preferences.timezone`. Adicionalmente, cada reminder e routine armazena o timezone vigente no momento da criação.

**Por quê:**
- Se o usuário mudar de timezone depois, os reminders antigos ainda disparam no timezone original (comportamento esperado para eventos fixos como aniversários)
- O trigger SQL usa `p_timezone` do próprio reminder para calcular `send_at` UTC correto
- `rotate_routines` usa `routine.timezone` para identificar o "amanhã" no fuso correto

---

### D9 — requestAndSubscribe nunca lança exceção

**Contexto:** a tela de notificações (S5 do onboarding) não pode travar o fluxo se o push falhar (iOS não instalado, VAPID não configurado, usuário nega).

**Decisão:** `requestAndSubscribe()` retorna `{ permission, subscribed, subscriptionError? }` sem nunca fazer `throw`.

**Por quê:**
- O onboarding continua para `/done` independentemente do resultado
- O caller pode mostrar uma mensagem informativa sem precisar de try/catch
- Erros de push são "não-fatais" por design (a notificação é uma feature, não o app em si)

---

### D10 — Ícones como SVG inline, não biblioteca

**Contexto:** o design tem ícones específicos que não existem em nenhuma biblioteca.

**Decisão:** SVGs inline em cada componente. Lucide React está instalado mas é usado minimamente.

**Por quê:**
- Controle pixel-perfect sobre o traçado (especialmente os ícones das tabs)
- Zero bundle de icons desnecessários — cada componente carrega só o que precisa
- Sem dependência externa para um elemento de UI crítico para o design

**Regra de lint:** biome exige `<title>` não-vazio em SVGs não-`aria-hidden`; todos os SVGs seguem o padrão do projeto.

---

### D11 — Design tokens como CSS custom properties, nunca hex literal no código

**Contexto:** o sistema de design tem tokens de cor para luz e escuro.

**Decisão:** `styles/tokens.css` define todos os tokens como `--color-*`; o `globals.css` mapeia para `@theme` do Tailwind v4. Biome tem uma regra `no-hex-ok` (comentário inline) para bloquear hex literais no código.

**Por quê:**
- Dark mode é automático via troca de CSS vars no `:root`
- O design source (`screens.jsx`, `tabs.jsx`, etc.) usa os mesmos nomes (`D.blue`, `D.ink`) — fácil de traduzir
- Bugs de cor são mais fáceis de diagnosticar quando há um único ponto de mudança

---

## 4. O que está pendente (pré-beta)

| Item | Prioridade | Notas |
|---|---|---|
| Forgot password funcional | Alta | Página existe mas é placeholder. Supabase tem `resetPasswordForEmail()`. |
| Sync Dexie (offline-first) | Média | Dexie instalado, banco local modelado mas outbox/sync não implementados. Atualmente o app requer conexão. |
| Landing page (`/`) | Alta | Phase 8 de beta. Atualmente `page.tsx` redireciona para `/welcome`. |
| Allow-list de emails | Alta | Phase 8. Nenhuma restrição de acesso além de auth normal. |
| Empty states visuais | Baixa | Existem mas são textos simples ("No routines today"). |
| Error states (sem conexão) | Baixa | `error.tsx` global existe. Estados específicos de rede não. |
| `mark_reminder_done` ≠ delete | Baixa | Atualmente é alias de delete. Em v1.1 deveria mover para tabela de histórico. |
| Quiet hours funcional | Baixa | `QuietHoursSwitch` persiste a preferência mas o `dispatch_push` não a lê. |
| `claim_pending` — cleanup de `processing` | Baixa | Rows travadas em `processing` não têm mecanismo de reset automático. |
| Stats — reminders incluídos | Baixa | A tela de Stats só conta routine_logs. Reminders não entram no cálculo. |

---

## 5. Mapa de arquivos chave

```
proxy.ts                          ← auth guard (Next.js 16 proxy convention)
lib/
  auth/actions.ts                 ← signUp, signIn, signOut, savePreferences, completeOnboarding
  reminders/
    schema.ts                     ← Zod schemas + tipos + visuais por tipo
    actions.ts                    ← createReminder, updateReminder, delete, markDone
  routines/
    schema.ts                     ← Zod schemas + tipos + formatDaysOfWeek
    actions.ts                    ← createRoutine, updateRoutine, delete, logSession, pause
  store/
    reminder-draft.ts             ← Zustand draft (8-step flow)
    routine-draft.ts              ← Zustand draft (5-step flow)
    onboarding.ts                 ← store temporário de onboarding
  push/subscribe.ts               ← requestAndSubscribe()
  time/reminder-time.ts           ← toUtcIso, fromUtcIso, format12h, timeUntilEvent, describeDaysUntil
  supabase/
    client.ts                     ← browser client (anon key)
    server.ts                     ← server client (cookies)
    middleware.ts                 ← updateSession() helper para proxy.ts
components/
  shared/
    BottomNav.tsx                 ← 4 tabs com ícones filled/outline; oculto fora das tabs
    FabWithSheet.tsx              ← FAB + creation sheet; only on tab routes
    FlowHeader.tsx                ← stepper header com progress bar e Cancel
    Button.tsx                   ← PrimaryButton + GhostButton
    Input.tsx                    ← Input com label flutuante
    QuietHoursSwitch.tsx          ← toggle dark-mode / quiet hours
    NotificationToggle.tsx        ← toggle push no You tab
    InstallPromptCapture.tsx      ← captura beforeinstallprompt no root layout
  reminders/
    TypeChip.tsx                  ← chips coloridos por tipo de reminder
    DatePicker.tsx                ← date picker iOS-like
    TimePicker.tsx                ← time picker iOS-like
  routines/
    RoutineCheckButton.tsx        ← check button colorido por tipo
    WeekdayPicker.tsx             ← toggle M/T/W/T/F/S/S
    TimeList.tsx                  ← lista editável de horários
  onboarding/
    TimeWheelPicker.tsx           ← scroll wheel para horário padrão
    NotificationPreview.tsx       ← mock de notificação iOS
supabase/
  migrations/
    0001_init.sql                 ← schema completo + touch_updated_at triggers
    0002_rls.sql                  ← RLS policies (own rows per table)
    0003_reminders_trigger.sql    ← generate_reminder_notifications + INSERT/UPDATE/DELETE triggers
    0004_notifications_unique.sql ← UNIQUE constraint + cancel trigger para routines
    0005_claim_notifications.sql  ← claim_pending_notifications() FOR UPDATE SKIP LOCKED
  functions/
    dispatch_push/index.ts        ← cron: drena scheduled_notifications via VAPID
    rotate_routines/index.ts      ← cron diário: gera notificações das rotinas do dia seguinte
```
