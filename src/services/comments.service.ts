import { eq } from 'drizzle-orm';
import { db } from '../../configurations/db_config.ts'
import { comments } from '../schemas/comments.ts'
import commentsInput from '../interfaces/comments.interface.ts';
import deleteCommentsInput  from '../interfaces/deleteComments.interface.ts';
import updateCommentsInput from '../interfaces/updateComments.interface.ts';

export const commentService = {
    getComments: async function () {
        try {
            return await db.select().from(comments);
        } catch (err) {
            return err;
        }
    },

    addComment: async function (data: commentsInput) {
        try {
            await db
                .insert(comments)
                .values([{
                    video_id: data.videoId,
                    user_id: data.userId,
                    comment_text: data.commentText,
                    parent_comment_id: data.parentCommentId ?? null
                }]);
        } catch (err) {
            return err;
        }
    },

    updateComment: async function (data: updateCommentsInput) {
        const { commentId, commentText } = data;
        try {
            await db
                .update(comments)
                .set({
                    comment_text: commentText
                })
                .where(eq(comments.comment_id, commentId));
        } catch (err) {
            return err;
        }
    },

    deleteComment: async function (data: deleteCommentsInput) {
        const { commentId } = data;
        try {
            await db
                .delete(comments)
                .where(eq(comments.comment_id, commentId));
        } catch (err) {
            return err;
        }
    }



    /* This to get over all list of comments score for a video */
    /* getTopComments: async function (videoId: number, limit: number) {
        try {
            const result = await db.execute(sql`SELECT * FROM get_top_comments(${videoId}, ${limit})`);
            return result.rows;
        } catch (err) {
            return err;
        }
    } */
}