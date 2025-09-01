import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const videos = pgTable('videos', {
  video_id: serial('video_id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
