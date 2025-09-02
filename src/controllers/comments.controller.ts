import { commentService } from '../services/comments.service.ts'
import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs';

export const commentController = {
    getCommentsDetails: async function (req: Request, res: Response) {
        try {
            const result = await commentService.getComments();
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    },
    getTopCommentsDetails: async function (req: Request, res: Response) {
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
    }
}


