import { and, eq } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts'
import { commentLikes } from '../schemas/commentLikes.ts'
import commentLikeInput from '../interfaces/commentLikes.interface.ts';
import deleteCommentLikeInput from '../interfaces/deleteCommentLikes.interface.ts';

export const commentLikesService = {
    getCommentLikes: async function () {
        try {
            return await db.select().from(commentLikes);
        } catch (err) {
            return err;
        }
    },
    addOrUpdateLike: async (data: commentLikeInput) => {
        // Insert or update if user already liked/disliked
        const { commentId, userId, likeFlag } = data;
        await db.insert(commentLikes)
            .values({
                comment_id: commentId,
                user_id: userId,
                like_flag: likeFlag,
            })
            .onConflictDoUpdate({
                target: [commentLikes.comment_id, commentLikes.user_id],
                set: { like_flag: likeFlag },
            }); //This ensures insert if new, update if exists, all in one query.

        // Trigger will automatically update score
    },

    removeLike: async (data: deleteCommentLikeInput) => {
        const { commentId, userId } = data;
        await db.delete(commentLikes)
            .where(
                and(
                    eq(commentLikes.comment_id, commentId),
                    eq(commentLikes.user_id, userId)
                )
            )
        // Trigger will automatically update score
    }
}