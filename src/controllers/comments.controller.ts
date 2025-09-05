import { commentService } from '../services/comments.service.ts'
import type { Request, Response } from 'express'

export const commentController = {
    getCommentsDetails: async function (req: Request, res: Response) {
        try {
            const parentCommentId = req.params.parentCommentId
                ? Number(req.params.parentCommentId)
                : undefined;
            const result = await commentService.getComments(Number(req.params.videoId), parentCommentId);
            res.status(200).send(result);
        } catch (err) {
            const error = err as Error;
            return res.status(400).json({ error: error.message });
        }
    },

    addCommentDetails: async function (req: Request, res: Response) {
        try {
            const result = await commentService.addComment(req.body);
            res.status(201).send(result);
        } catch (err) {
            const error = err as Error;
            return res.status(400).json({ error: error.message });
        }
    },

    updateCommentDetails: async function (req: Request, res: Response) {
        try {
            // Convert commentId from string (req.params) to number
            const commentId = Number(req.params.commentId);

            // Call service layer with a typed DTO containing commentId and updated text
            const pp = await commentService.updateComment({ commentId, commentText: req.body.commentText });

            res.status(200).send({ message: "Comment updated successfully" });
        } catch (err) {
            const error = err as Error;
            return res.status(400).json({ error: error.message });
        }
    },

    deleteCommentDetails: async function (req: Request, res: Response) {
        try {
            const commentId = Number(req.params.commentId);
            await commentService.deleteComment({ commentId });
            res.status(200).send({ message: "Comment deleted successfully" });
        } catch (err) {
            const error = err as Error;
            return res.status(400).json({ error: error.message });
        }
    }
}


