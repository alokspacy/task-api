import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json";
import { taskRepository } from "./repositories";
import authRouter from "./routes/auth";
import { supabase } from "./supabase";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks", "/auth/signup", "/auth/login"],
    });
});

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.get("/tasks", async (_req: Request, res: Response) => {
    const tasks = await taskRepository.findAll();
    res.status(200).json(tasks);
});

app.get("/tasks/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const task = await taskRepository.findById(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found",
        });
    }

    return res.status(200).json(task);
});

app.post("/tasks", async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required",
        });
    }

    const newTask = await taskRepository.create(title);

    return res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const task = await taskRepository.findById(id);

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

    const updatedTask = await taskRepository.update(id, { title, done });

    return res.status(200).json(updatedTask);
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await taskRepository.delete(id);

    if (!deleted) {
        return res.status(404).json({
            error: "Task not found",
        });
    }

    return res.status(204).send();
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server running and connected to Supabase`);
});