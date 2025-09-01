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
    }
}


