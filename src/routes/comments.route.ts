import { Router } from 'express'
import { commentController } from '../controllers/comments.controller.ts'
import { validateCommentFields } from '../middlewares/comments.middleware.ts';

export const commentsRouter = Router({ caseSensitive: true })

commentsRouter.get('/fetch/:videoId/:parentCommentId', validateCommentFields({ videoIdParam: true, getFlag: true }), commentController.getCommentsDetails);
commentsRouter.get('/fetch/:videoId', validateCommentFields({ videoIdParam: true, getFlag: true }), commentController.getCommentsDetails);
commentsRouter.post('/add', validateCommentFields({ videoId: true, userId: true, commentText: true }), commentController.addCommentDetails);
commentsRouter.patch('/update/:commentId', validateCommentFields({ commentIdParam: true, allowPartial: true }), commentController.updateCommentDetails);
commentsRouter.delete('/delete/:commentId', validateCommentFields({ commentIdParam: true, deleteFlag: true }), commentController.deleteCommentDetails);
