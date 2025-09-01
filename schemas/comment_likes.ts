import { pgTable, serial, integer, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { comments } from './comments';
import { users } from './users';

export const comment_likes = pgTable('comment_likes', {
  like_id: serial('like_id').primaryKey(),
  comment_id: integer('comment_id')
    .notNull()
    .references(() => comments.comment_id),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.user_id),
  like_flag: boolean('like_flag').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  unique_like: uniqueIndex('unique_comment_user').on(table.comment_id, table.user_id),
}));
