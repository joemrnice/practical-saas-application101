# Practical AI SaaS Application

A production-ready AI SaaS web app built with Next.js App Router, Supabase Auth/Postgres/Storage, OpenAI GPT-4o streaming, and Stripe subscriptions.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres%20%2B%20Storage-3ECF8E?logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)
![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-635BFF?logo=stripe)

## Overview

This app includes:
- Email/password + Google OAuth auth via Supabase SSR cookies
- Protected dashboard routes with middleware-based session checks
- AI content generation (blog/email/social/code) with streaming response rendering
- Free plan daily cap (10 generations/day), paid plan upgrade flow via Stripe Checkout
- Subscription sync from Stripe webhooks
- Generation history with pagination/filtering/delete
- Account settings for profile update, avatar upload, and account deletion

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS
- **Database/Backend:** Supabase (Auth, PostgreSQL, Storage)
- **AI:** OpenAI API (GPT-4o)
- **Billing:** Stripe subscriptions
- **Validation:** Zod for API input validation

## Local Setup

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/joemrnice/practical-saas-application101.git
   cd practical-saas-application101
   npm install
   ```

2. **Set environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in all values in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   OPENAI_API_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STRIPE_PRO_PRICE_ID=
   STRIPE_ENTERPRISE_PRICE_ID=
   ```

3. **Run Supabase migration**

   ```bash
   supabase db push
   ```

   Migration file:
   - `supabase/migrations/001_initial_schema.sql`

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Build and lint checks**

   ```bash
   npm run lint
   npm run build
   ```

## Stripe Webhook Local Testing

Use Stripe CLI forwarding:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the signing secret into:
- `STRIPE_WEBHOOK_SECRET`

## Folder Structure Summary

- `app/` — App Router pages, layouts, auth routes, protected dashboard, API routes
- `components/` — UI primitives + auth/dashboard/generate/billing/layout components
- `lib/` — Supabase clients/middleware, OpenAI helper, Stripe plan/config, utilities
- `hooks/` — User, subscription realtime, generation streaming state hooks
- `types/` — Supabase typed database + app shared types
- `supabase/migrations/` — SQL schema, RLS policies, auth trigger setup
- `middleware.ts` — route protection and auth redirects

## Deployment Notes

### Vercel
- Import repository into Vercel
- Set all environment variables from `.env.local.example`
- Ensure `NEXT_PUBLIC_APP_URL` is your deployed URL

### Supabase
- Create project and configure Auth providers (Email + Google)
- Run migration SQL in your Supabase project
- Create storage bucket named `avatars`
- Configure redirect URLs:
  - `http://localhost:3000/callback`
  - `https://your-domain.com/callback`

### Stripe
- Create products/prices for Pro and Enterprise
- Set `STRIPE_PRO_PRICE_ID` and `STRIPE_ENTERPRISE_PRICE_ID`
- Configure webhook endpoint:
  - `https://your-domain.com/api/stripe/webhook`
- Subscribe to events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
