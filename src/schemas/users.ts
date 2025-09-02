import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});
