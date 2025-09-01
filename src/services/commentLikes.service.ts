import { db } from '../../configurations/db_config.ts'
import { commentLikes } from '../../schemas/commentLikes.ts'

export const commentLikesService = {
    getCommentLikes: async function () {
        try {
            return await db.select().from(commentLikes);
        } catch (err) {
            return err;
        }
    }
}