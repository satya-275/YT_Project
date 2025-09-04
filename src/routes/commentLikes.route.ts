import { Router } from 'express'
import { commentLikesController } from '../controllers/commentLikes.controller.ts'

export const commentLikesRouter = Router({ caseSensitive: true})

commentLikesRouter.get('/commentlikes', commentLikesController.getCommentLikesDetails);
commentLikesRouter.post("/add", commentLikesController.likeComment);
commentLikesRouter.delete("/remove/:commentId/:userId", commentLikesController.removeLike);
