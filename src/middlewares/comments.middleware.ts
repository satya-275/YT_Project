import type { Request, Response, NextFunction } from "express";

export const validateCommentFields = (options: {
    commentIdParam?: boolean;          // if commentId must exist in params
    parentCommentIdParam?: boolean;    // if parentCommentIdParam is required
    videoId?: boolean;                 // if videoId is required
    pageNumberParam?: boolean;         // if pageNumberParam is required
    videoIdParam?: boolean;            // if videoIdParam is required
    userId?: boolean;                  // if userId is required
    commentText?: boolean;             // if commentText is required
    parentCommentId?: boolean;         // if parentCommentId is required
    allowPartial?: boolean;            // for PATCH (at least one field required)
    deleteFlag?: boolean               // request body will be ignored t/f
    getFlag?: boolean                  // request body will be ignored t/f
}) => {
    return (req: Request, res: Response, next: NextFunction) => {

        /* 1. Param validations */
        if (options.commentIdParam) {
            const { commentId } = req.params;
            if (!commentId || isNaN(Number(commentId))) {
                return res.status(400).json({ error: "Valid commentId must be provided in URL params" });
            }
        }

        if (options.videoIdParam) {
            const { videoId } = req.params;
            if (!videoId || isNaN(Number(videoId))) {
                return res.status(400).json({ error: "Valid videoId must be provided in URL params" });
            }
        }

        if (options.parentCommentIdParam) {
            const { parentCommentId } = req.params;
            if (!parentCommentId || isNaN(Number(parentCommentId))) {
                return res.status(400).json({ error: "Valid parentCommentId must be provided in URL params" });
            }
        }

        // delete flag to validate commentid param without body
        // get flag to validate videoidparam without body
        if (options.deleteFlag || options.getFlag) return next();

        const { videoId, userId, commentText, parentCommentId } = req.body;

        /* 2. Body validations (for POST/PUT) */
        if (options.videoId && (!videoId || isNaN(Number(videoId)))) {
            return res.status(400).json({ error: "Valid videoId is required and must be a number" });
        }

        if (options.userId && (!userId || isNaN(Number(userId)))) {
            return res.status(400).json({ error: "Valid userId is required and must be a number" });
        }

        if (options.commentText && (!commentText || typeof commentText !== "string")) {
            return res.status(400).json({ error: "commentText is required and must be a string" });
        }

        if (options.parentCommentId && parentCommentId !== undefined && parentCommentId !== null && isNaN(Number(parentCommentId))) {
            return res.status(400).json({ error: "parentCommentId must be a number if provided" });
        }

        /* 3. Partial validation (for PATCH) */
        if (options.allowPartial) {
            if (commentText && typeof commentText !== "string") {
                return res.status(400).json({ error: "commentText must be a string if provided" });
            }
        }

        next();
    };
};
