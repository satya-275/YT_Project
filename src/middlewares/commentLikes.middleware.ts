import type { Request, Response, NextFunction } from "express";

export const validateCommentLikesFields = (options: {
    commentIdParam?: boolean;   // if commentId must exist in params
    userIdParam?: boolean;      // if userId must exist in params
    commentIdBody?: boolean;    // if commentId is required in body
    userIdBody?: boolean;       // if userId is required in body
    likeFlag?: boolean;         // if likeFlag is required in body
    deleteFlag?: boolean;       // for removeLike (skip body validation)
}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        /* 1. Param validations */
        if (options.commentIdParam) {
            const { commentId } = req.params;
            if (!commentId || isNaN(Number(commentId))) {
                return res.status(400).json({ error: "Valid commentId must be provided in URL params" });
            }
        }

        if (options.userIdParam) {
            const { userId } = req.params;
            if (!userId || isNaN(Number(userId))) {
                return res.status(400).json({ error: "Valid userId must be provided in URL params" });
            }
        }

        /* If delete flag, skip body validation */
        if (options.deleteFlag) return next();

        const { commentId, userId, likeFlag } = req.body;

        /* 2. Body validations (for add/update) */
        if (options.commentIdBody && (!commentId || isNaN(Number(commentId)))) {
            return res.status(400).json({ error: "Valid commentId is required in body and must be a number" });
        }

        if (options.userIdBody && (!userId || isNaN(Number(userId)))) {
            return res.status(400).json({ error: "Valid userId is required in body and must be a number" });
        }

        if (options.likeFlag && (likeFlag === undefined || (likeFlag !== true && likeFlag !== false))) {
            return res.status(400).json({ error: "likeFlag is required and must be true or false" });
        }

        next();
    };
};
