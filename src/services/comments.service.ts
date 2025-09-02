import { db } from '../../configurations/db_config.ts'
import { comments } from '../schemas/comments.ts'

export const commentService = {
    getComments: async function () {
        try {
            return await db.select().from(comments);
        } catch (err) {
            return err;
        }
    }
}