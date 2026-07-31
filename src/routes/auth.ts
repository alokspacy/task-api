import { Request, Response, Router } from "express";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth";
import { supabase } from "../supabase";

const router = Router();

// POST /auth/signup
router.post("/signup", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (
        !email ||
        typeof email !== "string" ||
        email.trim() === "" ||
        !password ||
        typeof password !== "string" ||
        password.trim() === ""
    ) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
        message: "User created successfully",
        user: data.user,
        session: data.session,
    });
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (
        !email ||
        typeof email !== "string" ||
        email.trim() === "" ||
        !password ||
        typeof password !== "string" ||
        password.trim() === ""
    ) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.session) {
        return res.status(401).json({ error: "Invalid login credentials" });
    }

    return res.status(200).json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: data.user,
    });
});

// POST /auth/logout
router.post(
    "/logout",
    authMiddleware,
    async (_req: AuthenticatedRequest, res: Response) => {
        await supabase.auth.signOut();
        return res.status(204).send();
    }
);

export default router;
