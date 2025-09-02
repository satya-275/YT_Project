import { pgTable, serial, integer, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { videos } from "./videos.ts";
import { users } from "./users.ts";

export const comments = pgTable("comments", {
  comment_id: serial("comment_id").primaryKey(),
  video_id: integer("video_id")
    .notNull()
    .references(() => videos.video_id),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.user_id),
  parent_comment_id: integer("parent_comment_id"),
  comment_text: text("comment_text").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow()
},
  (table) => {
    return {
      parentReference: foreignKey({
        columns: [table.comment_id],
        foreignColumns: [table.comment_id],
        name: "parent_comment_fk"
      })
    }
  }
);