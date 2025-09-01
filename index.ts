import express from 'express';
import { db } from "./configurations/db_config.ts";
import { usersRouter } from "./src/routes/users.route.ts";
import { videosRouter } from "./src/routes/videos.route.ts";
import { commentsRouter } from "./src/routes/comments.route.ts";
import { commentLikesRouter } from "./src/routes/commentLikes.route.ts";

async function main() {
    try {
        const app = express();
        app.use(express.json(), express.urlencoded({ extended: true }));
        app.use('/users', usersRouter);
        app.use('/videos', videosRouter);
        app.use('/comments', commentsRouter);
        app.use('/commentlikes', commentLikesRouter);
        app.listen('5000', () => {
            console.log('Listening')
        })
        const res = await db.execute('SELECT current_database();');
        console.log(res.rows);

    } catch (err) {

    }
}

main().catch((err) => {

})
