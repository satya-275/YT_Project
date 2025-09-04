import { commentLikesService } from '../services/commentLikes.service.ts'
import type { Request, Response } from 'express'

export const commentLikesController = {
    getCommentLikesDetails: async function (req: Request, res: Response) {
        try {
            const result = await commentLikesService.getCommentLikes();
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    },
    
    likeComment: async (req: Request, res: Response) => {
        try {
            await commentLikesService.addOrUpdateLike(req.body);
            res.status(200).send({ message: "Like/Dislike applied successfully" });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    removeLike: async (req: Request, res: Response) => {
        try {
            const commentId = Number(req.params.commentId);
            const userId = Number(req.params.userId);
            await commentLikesService.removeLike({ commentId, userId });
            res.status(200).send({ message: "Like/Dislike removed successfully" });
        } catch (err) {
            res.status(400).send(err);
        }
    }
}


