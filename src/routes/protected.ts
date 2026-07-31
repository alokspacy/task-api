import { Request, Response, Router } from "express";

const router = Router();

// GET /protected/profile
router.get("/profile", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.trim() === "") {
        return res.status(401).json({
            error: "Access token required",
        });
    }

    // Do NOT verify token yet as specified in Stage 2 requirements
    return res.status(200).json({
        message: "Protected profile accessed",
    });
});

export default router;
