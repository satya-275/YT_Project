import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { videos } from './videos';
import { users } from './users';

export const comments = pgTable('comments', {
  comment_id: serial('comment_id').primaryKey(),
  video_id: integer('video_id')
    .notNull()
    .references(() => videos.video_id),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.user_id),
  parent_comment_id: integer('parent_comment_id')
    .references(() => comments.comment_id),
  comment_text: text('comment_text').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
