import { eq, desc, and, isNull } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts'
import { comments } from '../schemas/comments.ts'
import commentsInput from '../interfaces/comments.interface.ts';
import deleteCommentsInput from '../interfaces/deleteComments.interface.ts';
import updateCommentsInput from '../interfaces/updateComments.interface.ts';

export const commentService = {
    // No interface used here since params are simple (videoId + optional parentCommentId); can add one later if more filters/pagination are needed
    getComments: async function (videoId: number, parentCommentId?: number) {
        try {
            let query;

            if (parentCommentId !== undefined) {
                // Fetch replies to a specific comment
                query = db
                    .select()
                    .from(comments)
                    .where(
                        and(
                            eq(comments.video_id, videoId),
                            eq(comments.parent_comment_id, parentCommentId)
                        )
                    )
                    .orderBy(desc(comments.score));
            } else {
                // Fetch top-level comments
                query = db
                    .select()
                    .from(comments)
                    .where(
                        and(
                            eq(comments.video_id, videoId),
                            isNull(comments.parent_comment_id)
                        )
                    )
                    .orderBy(desc(comments.score));
            }

            return await query;
        } catch (err) {
            throw err;
        }
    },

    addComment: async function (data: commentsInput) {
        try {
            const result = await db
                .insert(comments)
                .values([{
                    video_id: data.videoId,
                    user_id: data.userId,
                    comment_text: data.commentText,
                    parent_comment_id: data.parentCommentId ?? null
                }]);
            if (result && result.rowCount === 0) {
                throw new Error("Comment cannot be added");
            }
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateComment: async function (data: updateCommentsInput) {
        const { commentId, commentText } = data;
        try {
            const result = await db
                .update(comments)
                .set({
                    comment_text: commentText
                })
                .where(eq(comments.comment_id, commentId));
            if (result && result.rowCount === 0) {
                throw new Error("Comment not found");
            }
            return result;
        } catch (err) {
            throw err;
        }
    },

    deleteComment: async function (data: deleteCommentsInput) {
        const { commentId } = data;
        try {
            const result = await db
                .delete(comments)
                .where(eq(comments.comment_id, commentId));

            // Postgres returns { rowCount: number }
            if (result && result.rowCount === 0) {
                throw new Error("Comment not found");
            }

            return result;
        } catch (err) {
            throw err;
        }
    }
}