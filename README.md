# Task API (Supabase Authentication & PostgreSQL Dockerized)

A production-grade RESTful Task Management API built with **Express.js**, **TypeScript**, **PostgreSQL**, **Supabase Authentication**, and **Docker**. The application supports user authentication, protected routes via JWT Bearer tokens, repository-pattern database access, and interactive Swagger UI documentation.

---

## Features

- **Supabase Authentication**: User registration (`signup`), login (`signInWithPassword`), and logout (`signOut`).
- **JWT Authorization Middleware**: Reusable Express middleware (`authMiddleware`) validating Bearer tokens with `supabase.auth.getUser(token)`.
- **Public & Protected Endpoints**: Public routes accessible without authentication; protected routes accessible only with valid JWT tokens.
- **Repository Architecture**: Decoupled database logic (`TaskRepository`) supporting both PostgreSQL and SQLite.
- **Docker Compose Orchestration**: Containerized application stack with automated database health checks (`pg_isready`).
- **Interactive Swagger UI**: Interactive API documentation at `/docs` featuring Bearer authentication lock icons and test authorization modal.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/alokspacy/task-api.git
cd task-api
npm install
```

---

## Environment Variables (`.env.example`)

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskdb
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

> [!CAUTION]
> Never commit `.env` to source control. `.env` is listed in `.gitignore` to prevent secret leaks.

---

## How to Run

### 1. Local Development Mode

Start the local server with hot-reloading:

```bash
npm run dev
```

The API server runs at:
```text
http://localhost:3000
```

Swagger UI documentation is available at:
```text
http://localhost:3000/docs
```

### 2. Docker Compose Mode (Full Stack)

Build and run both PostgreSQL and Express app containers:

```bash
docker compose up --build
```

---

## Authentication Flow

```
+--------+            +------------+            +----------------+
| Client |            | Express API|            | Supabase Auth  |
+----+---+            +-----+------+            +-------+--------+
     |                      |                           |
     |--- POST /auth/signup ------> supabase.auth.signUp()
     |                      |                           |
     |--- POST /auth/login -------> supabase.auth.signInWithPassword()
     |<-- { access_token } -|                           |
     |                      |                           |
     |--- GET /protected/* (Header: Bearer <token>) --->|
     |                      |--- supabase.auth.getUser(token) -> [Validated]
     |<-- 200 OK (Data) ----|                           |
     |                      |                           |
     |--- POST /auth/logout ------> supabase.auth.signOut()
```

1. **Signup (`POST /auth/signup`)**: Pass `email` and `password` to create a new user account.
2. **Login (`POST /auth/login`)**: Pass `email` and `password` to authenticate. Returns an `access_token` and `refresh_token`.
3. **Protected Requests**: Include the header `Authorization: Bearer <access_token>` in requests to protected routes.
4. **Logout (`POST /auth/logout`)**: Invalidate session using Supabase Auth.

---

## Public vs Protected Routes

- **Public Routes (`/public/info`, `/tasks`, `/health`, `/docs`)**: Require no authentication header. Accessible by anyone.
- **Protected Routes (`/protected/profile`, `/protected/dashboard`, `/auth/logout`)**: Must include a valid `Authorization: Bearer <access_token>` header. Requests missing tokens return `401 Unauthorized` (`Access token required`); requests with invalid tokens return `401 Unauthorized` (`Invalid or expired token`).

---

## API Endpoints Table

| Method | Endpoint | Access Level | Description | Status Codes |
|--------|----------|--------------|-------------|--------------|
| `GET` | `/` | Public | API Metadata | `200` |
| `GET` | `/health` | Public | Health Check | `200` |
| `GET` | `/public/info` | Public | Public Info Message | `200` |
| `POST` | `/auth/signup` | Public | User Signup | `201`, `400` |
| `POST` | `/auth/login` | Public | User Login | `200`, `400`, `401` |
| `POST` | `/auth/logout` | Protected | User Logout | `204`, `401` |
| `GET` | `/protected/profile` | Protected | User Profile Details | `200`, `401` |
| `GET` | `/protected/dashboard`| Protected | Protected Dashboard | `200`, `401` |
| `GET` | `/tasks` | Public | List all tasks | `200` |
| `GET` | `/tasks/:id` | Public | Get task by ID | `200`, `404` |
| `POST` | `/tasks` | Public | Create new task | `201`, `400` |
| `PUT` | `/tasks/:id` | Public | Update task | `200`, `400`, `404` |
| `DELETE`| `/tasks/:id` | Public | Delete task | `204`, `404` |

---

## Swagger UI Documentation

Access Swagger UI interactive documentation at `http://localhost:3000/docs`. Click **Authorize** at the top right and enter your Bearer `access_token` to test protected routes directly in the browser.

![Swagger UI Bearer Authentication Documentation](docs/swagger_bearer.png)

---

## Security Notes

1. **Token Validation**: The Express server uses `supabase.auth.getUser(token)` on every protected request to cryptographically verify token integrity and expiration.
2. **Secret Management**: API keys and database credentials are stored strictly in `.env` and loaded via `dotenv`. `.env` is ignored in `.gitignore`.
3. **HTTP Status Codes**:
   - `400 Bad Request`: Missing body parameters.
   - `401 Unauthorized`: Missing or invalid Bearer token / login credentials.
   - `404 Not Found`: Entity not found.

---

## Final Project Structure

```text
.
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── docker-compose.yml
├── init.sql
├── openapi.json
├── package-lock.json
├── package.json
├── tasks.db
├── tsconfig.json
├── docs/
│   ├── database.png
│   ├── docker.png
│   ├── swagger.png
│   └── swagger_bearer.png
└── src/
    ├── database.ts
    ├── index.ts
    ├── supabase.ts
    ├── database/
    │   └── postgres.ts
    ├── middleware/
    │   └── auth.ts
    ├── repositories/
    │   ├── index.ts
    │   ├── PostgresRepository.ts
    │   ├── SQLiteRepository.ts
    │   └── TaskRepository.ts
    └── routes/
        ├── auth.ts
        ├── protected.ts
        └── public.ts
```

---

## Author

Alok Singh