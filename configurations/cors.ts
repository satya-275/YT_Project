import type { Request, Response, NextFunction } from "express";
import { allowedOrigins } from "./domain_list.ts";

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }

        return next();
    }

    return res.status(403).send("Forbidden");
}
