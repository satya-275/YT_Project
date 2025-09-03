import { Router } from 'express'
import { commentLikesController } from '../controllers/commentLikes.controller.ts'

export const commentLikesRouter = Router({ caseSensitive: true})

commentLikesRouter.get('/commentlikes', commentLikesController.getCommentLikesDetails);
commentLikesRouter.post("/commentlikes", commentLikesController.likeComment);
commentLikesRouter.delete("/commentlikes", commentLikesController.removeLike);
