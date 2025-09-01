import { Router } from 'express'
import { userController } from '../controllers/videos.controller.ts'

export const videosRouter = Router({ caseSensitive: true})

videosRouter.get('/getvideos', userController.getVideosDetails)

