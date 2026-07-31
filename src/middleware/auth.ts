import { User } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { supabase } from "../supabase";

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.trim() === "") {
        return res.status(401).json({
            error: "Access token required",
        });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            error: "Access token required",
        });
    }

    const token = parts[1];
    if (!token || token.trim() === "") {
        return res.status(401).json({
            error: "Access token required",
        });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }

    req.user = data.user;
    next();
}
