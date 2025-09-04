import { commentService } from '../services/comments.service.ts'
import type { Request, Response } from 'express'

export const commentController = {
    getCommentsDetails: async function (req: Request, res: Response) {
        try {
            const result = await commentService.getComments();
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    },

    addCommentDetails: async function (req: Request, res: Response) {
        try {
            const result = await commentService.addComment(req.body);
            res.status(201).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    },

    updateCommentDetails: async function (req: Request, res: Response) {
        try {
            // Convert commentId from string (req.params) to number
            const commentId = Number(req.params.commentId);
            
            // Call service layer with a typed DTO containing commentId and updated text
            await commentService.updateComment({ commentId, commentText: req.body.commentText });  
            
            res.status(200).send({ message: "Comment updated successfully" });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    deleteCommentDetails: async function (req: Request, res: Response) {
        try {
            const commentId = Number(req.params.commentId);
            await commentService.deleteComment({ commentId });
            res.status(200).send({ message: "Comment deleted successfully" });
        } catch (err) {
            res.status(400).send(err);
        }
    }
}


