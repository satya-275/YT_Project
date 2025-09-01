import { Router } from 'express'
import { commentController } from '../controllers/comments.controller.ts'

export const commentsRouter = Router({ caseSensitive: true})

commentsRouter.get('/getcomments', commentController.getCommentsDetails)

