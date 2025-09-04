import { Router } from 'express';
import { commentLikesController } from '../controllers/commentLikes.controller.ts';
import { validateCommentLikesFields } from '../middlewares/commentLikes.middleware.ts';

export const commentLikesRouter = Router({ caseSensitive: true });

commentLikesRouter.get('/commentlikes', commentLikesController.getCommentLikesDetails);
commentLikesRouter.post('/add', validateCommentLikesFields({ commentIdBody: true, userIdBody: true, likeFlag: true }), commentLikesController.likeComment);
commentLikesRouter.delete('/remove/:commentId/:userId', validateCommentLikesFields({ commentIdParam: true, userIdParam: true, deleteFlag: true }), commentLikesController.removeLike);
