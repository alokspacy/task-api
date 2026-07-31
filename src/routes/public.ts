import { Request, Response, Router } from "express";

const router = Router();

// GET /public/info
router.get("/info", (_req: Request, res: Response) => {
    return res.status(200).json({
        message: "Welcome stranger! This info is public.",
    });
});

export default router;
