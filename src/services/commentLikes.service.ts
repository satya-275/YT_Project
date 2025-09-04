import { and, eq } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts';
import { commentLikes } from '../schemas/commentLikes.ts';
import commentLikeInput from '../interfaces/commentLikes.interface.ts';
import deleteCommentLikeInput from '../interfaces/deleteCommentLikes.interface.ts';

export const commentLikesService = {
    getCommentLikes: async function () {
        try {
            const result = await db.select().from(commentLikes);
            return result; // empty array if no likes
        } catch (err) {
            throw err;
        }
    },

    addOrUpdateLike: async (data: commentLikeInput) => {
        const { commentId, userId, likeFlag } = data;
        try {
            const result = await db.insert(commentLikes)
                .values({
                    comment_id: commentId,
                    user_id: userId,
                    like_flag: likeFlag,
                })
                .onConflictDoUpdate({
                    target: [commentLikes.comment_id, commentLikes.user_id],
                    set: { like_flag: likeFlag },
                });

            if (result && result.rowCount === 0) {
                throw new Error("Like/Dislike could not be added/updated");
            }

            return result;
        } catch (err) {
            throw err;
        }
    },

    removeLike: async (data: deleteCommentLikeInput) => {
        const { commentId, userId } = data;
        try {
            const result = await db.delete(commentLikes)
                .where(
                    and(
                        eq(commentLikes.comment_id, commentId),
                        eq(commentLikes.user_id, userId)
                    )
                );

            if (result && result.rowCount === 0) {
                throw new Error("Like/Dislike not found");
            }

            return result;
        } catch (err) {
            throw err;
        }
    }
};
