import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json";
import "./database";

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    {
        id: 1,
        title: "Learn Express",
        done: false,
    },
    {
        id: 2,
        title: "Complete Assignment",
        done: true,
    },
    {
        id: 3,
        title: "Push to GitHub",
        done: false,
    },
];

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
    res.status(200).json(tasks);
});

app.get("/tasks/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`,
        });
    }

    return res.status(200).json(task);
});

app.post("/tasks", (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required",
        });
    }

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        done: false,
    };

    tasks.push(newTask);

    return res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`,
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

    if (title !== undefined) task.title = title;
    if (done !== undefined) task.done = done;

    return res.status(200).json(task);
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: `Task ${id} not found`,
        });
    }

    tasks.splice(index, 1);

    return res.status(204).send();
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});