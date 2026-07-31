import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json";
import db from "./database";

const app = express();
const PORT = 3000;

app.use(express.json());

type TaskRow = {
    id: number;
    title: string;
    done: number;
};

function mapTaskRow(task: TaskRow) {
    return {
        id: task.id,
        title: task.title,
        done: task.done === 1,
    };
}

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"],
    });
});

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.get("/tasks", (_req: Request, res: Response) => {
    const tasksFromDatabase = db.prepare("SELECT * FROM tasks;").all() as TaskRow[];

    res.status(200).json(tasksFromDatabase.map(mapTaskRow));
});

app.get("/tasks/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?;")
        .get(id) as TaskRow | undefined;

    if (!task) {
        return res.status(404).json({
            error: "Task not found",
        });
    }

    return res.status(200).json(mapTaskRow(task));
});

app.post("/tasks", (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required",
        });
    }

    const insertTask = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?);"
    );
    const result = insertTask.run(title, 0);

    const newTask = {
        id: Number(result.lastInsertRowid),
        title,
        done: false,
    };

    return res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?;")
        .get(id) as TaskRow | undefined;

    if (!task) {
        return res.status(404).json({
            error: "Task not found",
        });
    }

    if (
        (title !== undefined &&
            (typeof title !== "string" || title.trim() === "")) ||
        (done !== undefined && typeof done !== "boolean")
    ) {
        return res.status(400).json({
            error: "Invalid request body",
        });
    }

    const updatedTitle = title !== undefined ? title : task.title;
    const updatedDone = done !== undefined ? (done ? 1 : 0) : task.done;

    db.prepare(
        "UPDATE tasks SET title = ?, done = ? WHERE id = ?;"
    ).run(updatedTitle, updatedDone, id);

    return res.status(200).json({
        id: task.id,
        title: updatedTitle,
        done: updatedDone === 1,
    });
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = db.prepare("DELETE FROM tasks WHERE id = ?;").run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Task not found",
        });
    }

    return res.status(204).send();
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});