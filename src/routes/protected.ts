import { Response, Router } from "express";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth";

const router = Router();

// Protect all routes in this router with authMiddleware
router.use(authMiddleware);

// GET /protected/profile
router.get("/profile", (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({
        message: "Protected profile accessed",
        user: req.user,
    });
});

// GET /protected/dashboard
router.get("/dashboard", (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({
        message: "Welcome to your protected dashboard!",
        user: req.user,
    });
});

export default router;
