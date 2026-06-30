# CallPilot.AI - Enterprise Conversation Intelligence & QA Audit

CallPilot.AI is a premium, real-time conversation intelligence and quality assurance platform designed for BPO centers, call centers, and customer support organizations. Powered by Next.js and Google Gemini AI, CallPilot automatically processes audio recording logs to score compliance checkmarks, map escalations, and draft CRM contact files.

---

## Key Features

1. **Automated QA Checklists**: Instantly evaluates call audio against compliance parameters (e.g. branded greetings, identity verification, disclosure statements).
2. **AI Coach & soft-skills advice**: Pinpoints interruptions, silences, and wrong tones. Generates professional coaching advice and recommended script responses with explanations.
3. **Sentiment Timeline Chart**: Renders interactive client-agent emotional timelines mapping Happy, Neutral, Confused, Angry, and Frustrated peaks.
4. **CRM Summary Notes**: Translates long calls into structured titles, issues, resolutions, and action items with one-click copy and JSON download mechanisms.
5. **AI Semantic Search**: Ask questions like *"Show angry customers"* or *"billing issues"* to search through recordings, transcript files, and compliance scores.
6. **Enterprise Admin Panel**: Integrated views to manage users, assign teams, check role access controls (RBAC), modify Gemini models, track API cost charts, and adjust subscription billing metrics.

---

## Tech Stack & Architecture

- **Frontend**: Next.js 16.2.9 (App Router, Turbopack, TailwindCSS, Lucide Icons)
- **Database Engine**: Prisma ORM with native SQLite database engines.
- **AI Core**: Google Gemini LLM API integration.
- **Authentication**: Supabase Auth (with offline sandbox mocks for local dev).

---

## Local Development Setup

### 1. Configure Environments
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
PRISMA_CLIENT_ENGINE_TYPE="library"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="mock-anon-key"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Install Packages & Initialize Database
```bash
# Install dependencies
npm install

# Initialize local SQLite database schema
npx prisma db push

# Rebuild local client
npx prisma generate
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port logged by Next.js) to interact with the platform.

---

## Deployment to Production
To deploy to a production cloud like Vercel, read the [Vercel Deployment Guide](.agents/deployment-guide.md) or see our [Environment Variables Guide](.agents/environment-variables.md) for remote database setup.
