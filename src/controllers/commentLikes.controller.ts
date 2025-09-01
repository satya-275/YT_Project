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
    }
}


