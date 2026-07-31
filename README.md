# Task API (PostgreSQL & Dockerized Version)

A RESTful Task Management API built with **Express.js**, **TypeScript**, **PostgreSQL**, and **Docker**. The application uses a decoupled **Repository Pattern** architecture to seamlessly manage database access, exposes CRUD endpoints, and includes interactive Swagger UI documentation.

---

## Features

- Full CRUD endpoints for managing tasks (`GET`, `POST`, `PUT`, `DELETE`).
- **PostgreSQL 16** integration with automated table schema setup (`init.sql`).
- **Repository Pattern Architecture** decoupling database logic from HTTP routes.
- **Docker & Docker Compose** orchestration with container healthchecks.
- Data persistence via Docker named volume (`postgres_data`).
- Environment variable configuration via `.env`.
- Interactive Swagger UI documentation at `/docs`.

---

## Tech Stack

- **Runtime & Language:** Node.js, TypeScript, Express.js
- **Database:** PostgreSQL 16 (`pg` pool)
- **Containerization:** Docker, Docker Compose
- **Documentation:** Swagger UI (`swagger-ui-express`)

---

## Project Architecture & Repository Pattern

This project implements the **Repository Pattern** to separate business and routing logic from data persistence logic.

```
[ Express Routes ] ---> [ TaskRepository Interface ]
                             |
             +---------------+---------------+
             |                               |
  [ SQLiteRepository ]             [ PostgresRepository ]
  (Legacy SQLite DB)               (Active PostgreSQL DB)
```

> [!IMPORTANT]
> **Zero Route Changes:** When migrating from SQLite (`BE-02`) to PostgreSQL (`BE-04`), **only the repository implementation changed**. All HTTP routes, controllers, request validations, response status codes, and JSON response formats remained 100% unchanged due to dependency injection via `TaskRepository`.

### `TaskRepository` Interface

```typescript
export interface Task {
    id: number;
    title: string;
    done: boolean;
}

export interface TaskRepository {
    findAll(): Promise<Task[]>;
    findById(id: number): Promise<Task | null>;
    create(title: string): Promise<Task>;
    update(id: number, data: { title?: string; done?: boolean }): Promise<Task | null>;
    delete(id: number): Promise<boolean>;
}
```

---

## Environment Variables

Environment variables are configured in `.env` (derived from `.env.example`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskdb
```

In the Docker Compose setup, the `app` container automatically communicates with the `postgres` container over Docker's internal network using:
`DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taskdb?schema=public`

---

## How to Run with Docker Compose

### 1. Start the Complete Stack (App + PostgreSQL)

Build and run both PostgreSQL and the Express API server:

```bash
docker compose up --build
```

The Express `app` service automatically waits until the `postgres` service passes health checks (`pg_isready`) before starting.

The application runs at:
```text
http://localhost:3000
```

Swagger UI documentation is available at:
```text
http://localhost:3000/docs
```

### 2. Run Only PostgreSQL Container

If you want to run PostgreSQL in Docker while running the Node application locally:

```bash
docker compose up -d postgres
npm run dev
```

### 3. Stop the Containers

```bash
docker compose down
```

---

## Data Persistence & Testing

Data persistence is configured using a Docker named volume in `docker-compose.yml`:

```yaml
volumes:
  postgres_data:
    # Mounted to /var/lib/postgresql/data inside the container
```

### How Persistence Was Tested:

1. **Start Stack:** Run `docker compose up -d`.
2. **Create Data:** Send a `POST` request to `http://localhost:3000/tasks` to create new tasks.
3. **Stop & Remove Containers:** Run `docker compose down` (which stops and removes active containers while keeping the named volume intact).
4. **Restart Stack:** Run `docker compose up -d`.
5. **Verify Data:** Send a `GET` request to `http://localhost:3000/tasks`. All created tasks remain persisted across container restarts.

---

## API Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `GET` | `/` | API Metadata | `200 OK` |
| `GET` | `/health` | Health Check | `200 OK` |
| `GET` | `/tasks` | List all tasks | `200 OK` |
| `GET` | `/tasks/:id` | Get task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create a new task | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update title or done status | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete task by ID | `204 No Content` / `404 Not Found` |

---

## Screenshot Placeholders

### 1. Docker Compose Services & Health Check
![Docker Execution Screenshot](docs/docker.png)
*Placeholder: Screenshot of `docker compose ps` showing running app and healthy postgres containers.*

### 2. PostgreSQL Table & Database Verification
![Database Screenshot](docs/database.png)
*Placeholder: Screenshot showing `tasks` table schema and stored rows in PostgreSQL.*

### 3. Interactive Swagger UI
![Swagger UI Screenshot](docs/swagger.png)
*Placeholder: Screenshot showing Swagger UI documentation at `/docs`.*

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
│   └── swagger.png
└── src/
    ├── database.ts
    ├── index.ts
    ├── database/
    │   └── postgres.ts
    └── repositories/
        ├── index.ts
        ├── PostgresRepository.ts
        ├── SQLiteRepository.ts
        └── TaskRepository.ts
```

---

## Author

Alok Singh