import { Router } from 'express'
import { commentController } from '../controllers/comments.controller.ts'
import { validateCommentFields } from '../middlewares/comments.middleware.ts';

export const commentsRouter = Router({ caseSensitive: true })

commentsRouter.get('/getcomments', commentController.getCommentsDetails);
commentsRouter.post('/add', validateCommentFields({ videoId: true, userId: true, commentText: true }), commentController.addCommentDetails);
commentsRouter.patch('/update/:commentId', validateCommentFields({ commentIdParam: true, allowPartial: true }), commentController.updateCommentDetails);
commentsRouter.delete('/delete/:commentId', validateCommentFields({ commentIdParam: true, deleteFlag: true }), commentController.deleteCommentDetails);
