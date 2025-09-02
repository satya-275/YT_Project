import express from "express";
import { usersRouter } from "./routes/users.route.ts";
import { videosRouter } from "./routes/videos.route.ts";
import { commentsRouter } from "./routes/comments.route.ts";
import { commentLikesRouter } from "./routes/commentLikes.route.ts";
// import { corsMiddleware } from "./../configurations/cors.ts";

export function createServer() {
    const app = express();
    app.use(express.json());
    //   app.use(corsMiddleware); //browser domain access restriction postman can bypass it so commented out

    app.use("/users", usersRouter);
    app.use("/videos", videosRouter);
    app.use("/comments", commentsRouter);
    app.use("/commentlikes", commentLikesRouter);

    return app;
}
