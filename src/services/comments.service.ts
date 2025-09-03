import { sql } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts'
import { comments } from '../schemas/comments.ts'

export const commentService = {
    getComments: async function () {
        try {
            return await db.select().from(comments);
        } catch (err) {
            return err;
        }
    },

    


    /* This to get over all list of comments score for a video */
    getTopComments: async function (videoId: number, limit: number) {
        try {
            const result = await db.execute(sql`SELECT * FROM get_top_comments(${videoId}, ${limit})`);
            return result.rows;
        } catch (err) {
            return err;
        }
    }
}