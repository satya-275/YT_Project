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
            const { commentId } = req.params;
            const { commentText } = req.body;

            await commentService.updateComment(Number(commentId), commentText);
            res.status(200).send({ message: "Comment updated successfully" });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    deleteCommentDetails: async function (req: Request, res: Response) {
        try {
            const { commentId } = req.params;

            await commentService.deleteComment(Number(commentId));
            res.status(200).send({ message: "Comment deleted successfully" });
        } catch (err) {
            res.status(400).send(err);
        }
    }


    /* This to get over all list of comments score for a video */
    /* getTopCommentsDetails: async function (req: Request, res: Response) {
        try {
            const videoIdRaw: string | ParsedQs | (string | ParsedQs)[] | undefined = req.query.videoId;
            const limitRaw: string | ParsedQs | (string | ParsedQs)[] | undefined = req.query.limit;
            
            const videoId = Number(videoIdRaw);
            const limit = Number(limitRaw);
            
            const result = await commentService.getTopComments(videoId, limit);
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    } */
}


