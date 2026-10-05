# KYK Technologies

KYK keeps its approved React/Vite frontend and adds a modular Node.js + Express + MySQL REST API.

## Requirements

- Node.js 20+
- pnpm or npm
- MySQL 8+

## Database setup

1. Create a MySQL user with access to the database.
2. Run `mysql -u root -p < backend/database/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env` and set the values.
4. Create the first admin with `cd backend && pnpm create-admin --name "KYK Admin" --email admin@example.com --password "use-a-strong-password"`.

Never commit `backend/.env` or real credentials.

## Run locally

Terminal 1: `pnpm dev` starts the Vite frontend at `http://localhost:5173`.

Terminal 2: `cd backend && pnpm dev` starts Express at `http://localhost:5000`.

Set `CLIENT_URL=http://localhost:5173` for local CORS. The frontend API base is controlled by `VITE_API_URL` and defaults to `http://localhost:5000/api`.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/jobs`, `GET /api/jobs/:id`
- Admin: `POST/PUT/DELETE /api/jobs`, `GET /api/dashboard`
- `POST /api/applications`, `GET /api/applications/mine`
- Admin: `GET /api/applications`, `PUT /api/applications/:id`
- `POST /api/contact`
- Admin: `GET /api/contact`, `PUT /api/contact/:id`
- Admin: `GET /api/employees`
- Employee: `GET /api/employee/me`
- `GET /api/health`

JWTs are stored in an HttpOnly cookie. Role checks are enforced by Express middleware, not only by frontend visibility. Resume upload is prepared through `resume_url`; connect a storage provider later without changing the applications contract.

## Development workflow

Build or update the SQL schema first, start MySQL, then start Express and the frontend. Use the admin account for protected job, application, contact, and dashboard requests. Candidate registration is intentionally the only public registration role.

The initial version intentionally excludes attendance, payroll, leave, and advanced HRMS modules.
