import { db } from '../../configurations/db_config.ts'
import { videos } from '../schemas/videos.ts'

export const videoService = {
    getVideos: async function () {
        try {
            return await db.select().from(videos);
        } catch (err) {
            return err;
        }
    }
}