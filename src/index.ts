import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Root Endpoint
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"],
    });
});

// Health Endpoint
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});