# SpendWise Frontend

Frontend repository for the **Personal Expense & Social Debt Tracker** for Students and Young Professionals project @ A2SV.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** TanStack React Query
- **HTTP Client:** Axios
- **Auth Storage:** js-cookie

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` (or create `.env.local`) with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BYPASS_AUTH=true
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_BYPASS_AUTH` | Set to `true` to use mock auth routes (no backend needed) |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication Setup

The app uses JWT-based authentication with access/refresh token rotation.

### Architecture

```
lib/
├── auth/
│   └── token.ts          # Token storage (cookies) & session helpers
├── api/
│   ├── auth.ts           # Auth API calls (login, register, refresh, logout)
│   └── client.ts         # Axios client with token interceptors & auto-refresh
```

### Auth Flow

1. **Login** (`/login`) → calls `POST /auth/login` → stores tokens → redirects to `/dashboard`
2. **Signup** (`/signup`) → calls `POST /auth/register` → auto-calls login → redirects to `/dashboard`
3. **Token refresh** → on any `401` response, the Axios interceptor automatically calls `POST /auth/refresh`, rotates both tokens, and retries the original request
4. **Logout** → calls `POST /auth/logout` with refresh token → clears all stored tokens

### Mock Auth Mode (for development without backend)

When `NEXT_PUBLIC_BYPASS_AUTH=true`, mock API routes intercept auth requests locally:

```
app/api/proxy/auth/
├── login/route.ts        # Mock login endpoint
├── register/route.ts     # Mock register endpoint
├── refresh/route.ts      # Mock token refresh
└── logout/route.ts       # Mock logout
```

**Test credentials (mock mode):**
- Email: `john@example.com`
- Password: `Secure123!`

You can also sign up with any new email — the mock stores users in memory for the session.

### Switching to Real Backend

When the backend team has deployed their server:

1. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://<deployed-backend-url>:8080
   NEXT_PUBLIC_BYPASS_AUTH=false
   ```

2. **Delete the mock routes folder:**
   ```bash
   rm -rf app/api/proxy/auth/
   ```

3. **Restart the dev server.** That's it — no code changes required.

The `next.config.ts` proxy rewrite will route `/api/proxy/*` requests to the real backend URL automatically.

---

## Project Structure

```
app/
├── login/                # Login page
├── signup/               # Signup page
├── (protected)/          # Auth-protected routes
│   ├── dashboard/        # Main dashboard
│   ├── log/              # Expense log
│   ├── debt/             # Debt tracker
│   ├── spending/         # Spending analysis
│   └── settings/         # User settings
├── api/proxy/auth/       # Mock auth routes (delete when backend is ready)
components/               # Shared UI components
lib/
├── api/                  # API client, services, hooks
│   ├── client.ts         # Axios instance with interceptors
│   ├── auth.ts           # Auth service
│   └── hooks/            # React Query hooks
├── auth/
│   └── token.ts          # Token management
└── utils/                # Utility functions
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |