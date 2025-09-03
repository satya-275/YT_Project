export default interface commentsInput {
    videoId: number;
    userId: number;
    parentCommentId?: number | null;
    commentText: string;
}
