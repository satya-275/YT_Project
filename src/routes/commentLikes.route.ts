import { Router } from 'express'
import { commentLikesController } from '../controllers/commentLikes.controller.ts'

export const commentLikesRouter = Router({ caseSensitive: true})

commentLikesRouter.get('/getcommentlikes', commentLikesController.getCommentLikesDetails)

