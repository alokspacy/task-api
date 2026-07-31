# Task API

A Task API built with Express.js, TypeScript, and SQLite. The application starts with sample tasks, persists data in `tasks.db`, and exposes CRUD endpoints with Swagger UI documentation.

## Features

- Create, read, update, and delete tasks
- SQLite persistence with `better-sqlite3`
- Automatic database and table creation on startup
- Sample tasks seeded only once
- Swagger UI for API exploration

## Tech Stack

- Node.js
- Express.js
- TypeScript
- SQLite
- better-sqlite3
- Swagger UI

## Installation

```bash
git clone https://github.com/<YOUR_USERNAME>/task-api.git
cd task-api
npm install
```

## How to Run

```bash
npm run dev
```

The application runs at:

```text
http://localhost:3000
```

Swagger UI is available at:

```text
http://localhost:3000/docs
```

On first launch the app automatically:

- creates `tasks.db` in the project root
- creates the `tasks` table if it does not exist
- inserts the sample tasks only when the table is empty

## Why SQLite

SQLite was chosen because it is lightweight, has no separate database server, works well for a small task API, and keeps the project easy to clone and run on any machine. It also supports reliable persistence without adding deployment complexity.

## Database Location

The database file is stored in the project root as:

```text
tasks.db
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | API info |
| GET | /health | Health check |
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get a task by ID |
| POST | /tasks | Create a task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

## Example SQL

```sql
SELECT * FROM tasks;
```

## Example cURL Request

```bash
curl -X POST http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-d "{\"title\":\"Buy milk\"}"
```

## DB Browser for SQLite

Open `tasks.db` in DB Browser for SQLite and browse the `tasks` table to inspect the stored rows.

![Database screenshot](docs/database.png)

## Swagger UI Screenshot

![Swagger UI](docs/swagger.png)

## Repository Structure

```text
.
├── docs/
│   ├── database.png
│   └── swagger.png
├── src/
│   ├── database.ts
│   └── index.ts
├── openapi.json
├── package.json
├── README.md
├── tasks.db
└── tsconfig.json
```

## Future Improvements

- Add request/response validation middleware
- Add pagination and filtering for `/tasks`
- Add automated tests
- Migrate write operations to a dedicated service layer
- Add environment-based configuration for the database path

## Author

Alok Singh