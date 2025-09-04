import { videoService } from '../services/videos.service.ts'
import type { Request, Response } from 'express'

export const userController = {
    getVideosDetails: async function (req: Request, res: Response) {
        try {
            const result = await videoService.getVideos();
            res.status(200).send(result);
        } catch (err) {
    const error = err as Error;
    return res.status(400).json({ error: error.message });
}
    }
}


