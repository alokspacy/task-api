# Task API

A simple CRUD Task API built with Express.js and TypeScript.

## Features

- Create Tasks
- Read Tasks
- Update Tasks
- Delete Tasks
- Swagger UI Documentation

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Swagger UI

## Installation

```bash
git clone https://github.com/<YOUR_USERNAME>/task-api.git
cd task-api
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

Swagger UI:

```
http://localhost:3000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | / | API Info |
| GET | /health | Health Check |
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get task by ID |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

---

## Example cURL

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d "{\"title\":\"Buy milk\"}"
```

---

## Swagger UI

Add your Swagger screenshot here after uploading it to GitHub.

```
![Swagger UI](docs/swagger.png)
```

---

## Author

Alok Singh