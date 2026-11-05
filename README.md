# StudyHub: Open-Source Digital Library & Private Focus Study Platform

A modern, full-stack open-access education platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage, and Row Level Security)**.

---

## 🌟 Key Features

### 1. Mandatory Authentication Gate
- **Strict Public Whitelist**: The ONLY pages accessible without login are `/`, `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/terms`, and `/privacy`.
- **Edge Middleware**: Any unauthenticated request to `/dashboard`, `/library`, `/reader/*`, `/tools`, `/notes`, `/flashcards`, `/profile`, or `/settings` is instantly intercepted and redirected to `/signin?returnTo=<path>`.
- **Brute-Force Protection**: 5-attempt rate limiter with automated 60-second lockout.
- **Secure File Storage**: 60-minute expiring signed URLs generated via `/api/books/signed-url`; zero public bucket links.

### 2. Private Dashboard & Strict Data Isolation
- **PostgreSQL Row Level Security (RLS)**: Enforces `auth.uid() = user_id` on all personal records. No user can view or modify another user's study sessions, notes, reading progress, or stats.
- **Customizable Widgets**: Show/hide widgets dynamically for Study Time, Streak Tracker, Continue Reading, Daily Goals / To-Dos, Exam Countdown, and Badges.
- **Profile Privacy Toggle**: Profiles are **private by default** with an opt-in toggle.

### 3. Open-Source Digital Library
- **Taxonomy**: `Subject` > `Class / Target Level` > `Book`.
- **Supported Formats**: PDF & EPUB (up to 100 MB).
- **Mandatory Open Licensing**: Creative Commons (CC BY, CC BY-SA), Public Domain / CC0, MIT / GNU FDL, or Author Written Permission.
- **Copyright Protection**:
  - Required checkbox certification: *"I confirm I have the right to share this file."*
  - Client-side SHA-256 duplicate file hashing using `crypto.subtle.digest`.
  - In-app DMCA reporting modal submitting to admin moderation queue.
  - Download counter tracking.

### 4. Interactive Online Reader
- **Themes**: Dark Night Mode, Warm Sepia, and Clean Light.
- **Controls**: Zoom (60% to 180%), Page Jump, Fullscreen focus.
- **Accessibility**: In-browser Text-to-Speech (TTS) using Web Speech Synthesis API.
- **Smart Tools**: Text selection dictionary lookup and page-specific markdown note-taking.
- **Progress Persistence**: Automatically remembers and resumes from your last read page via Supabase `reading_progress`.

### 5. Study Tools & Focus Room
- **Pomodoro Timer**: 25m Focus / 5m Short Break / 15m Long Break with full-screen distraction-free mode.
- **Synthetic Ambient Audio**: Pure Web Audio API brown/pink noise synthesizer (Gentle Rain, Office Hum, Coffeehouse) with zero external audio assets required.
- **AI Study Partner**: Real-time Concept Explainer, Chapter Summarizer, and Practice Quiz Generator.
- **Spaced Repetition Flashcards**: SuperMemo SM-2 algorithm calculating ease factor and review intervals.

### 6. Role-Based Admin Panel (`/admin`)
- Accessible to users with `role: 'admin'` or `'moderator'`.
- Review and approve/reject pending book submissions.
- Resolve DMCA copyright complaints and takedown infringing documents.
- User management and suspend/unsuspend toggles.
- Real-time study platform analytics.

### 7. GDPR Compliance
- **Article 20 (Data Portability)**: Export complete JSON archive of all study logs, notes, flashcards, and reading history in one click.
- **Article 17 (Right to Erasure)**: Irreversible one-click account deletion and database cascade purge.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.16.0)
- npm or pnpm

### 2. Installation
```bash
cd studyhub
npm install
```

### 3. Configure Supabase Environment Variables
Copy `.env.example` to `.env.local` and add your project credentials from [Supabase Settings > API](https://supabase.com/dashboard):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup Database Schema & Seed Data
1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to the **SQL Editor**.
3. Copy and run the contents of [`supabase/schema.sql`](file:///c:/Users/1212/Downloads/PROGESS/studyhub/supabase/schema.sql).
4. Copy and run the contents of [`supabase/seed.sql`](file:///c:/Users/1212/Downloads/PROGESS/studyhub/supabase/seed.sql) to populate open-source textbooks.

### 5. Run Security & Auth Guard Tests
```bash
npm run test:auth
```
*Executes all 25 automated security tests verifying public route whitelisting, protected route redirection, 60-minute signed URLs, and RLS schema enforcement.*

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security Architecture

| Security Layer | Implementation |
|---|---|
| **Middleware Gate** | Intercepts all requests at edge; checks Supabase SSR session token |
| **Data Isolation** | PostgreSQL Row Level Security (`auth.uid() = user_id`) on all 12 user tables |
| **File Storage** | Storage bucket `study-documents` is private; access only via 60-minute signed URLs |
| **Input Validation** | Zod schemas with strong password enforcement (uppercase, lowercase, number, symbol) |
| **Duplicate Prevention** | Web Crypto SHA-256 file hashing before storage write |
| **Rate Limiting** | 5 failed login attempts trigger 60-second client-side lockout |
| **Audit Trails** | `audit_logs` table records significant administrative actions |

---

## 📄 License
This platform is open-source educational software. All bundled seed books are licensed under Creative Commons (CC BY, CC BY-SA) or reside in the Public Domain.
