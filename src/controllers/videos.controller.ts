import { videoService } from '../services/videos.service.ts'
import type { Request, Response } from 'express'

export const userController = {
    getVideosDetails: async function (req: Request, res: Response) {
        try {
            const result = await videoService.getVideos();
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}


