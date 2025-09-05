# 📺 YouTube Comments Backend (TypeScript + Drizzle ORM + Postgres)

This project implements a backend to support **YouTube-style comments and replies** with ranking for "Top Comments". It is built with **TypeScript**, **Express.js**, **Drizzle ORM**, and **Postgres**.

---

## 🚀 Features / Use Cases

1. **Post a comment** on a video (root comment).
2. **Reply** to a comment (nested comments, depth=1).
3. **Like/Dislike a comment** (engagement tracking).
4. **Fetch top comments** (ranked via score formula).
5. **Fetch all replies** for a comment.
6. **Delete comments / replies** with score recalculation.
7. **Trigger-based score updates** on `INSERT`, `UPDATE`, `DELETE`.

---


## 🗄️ Database Model

### 🗄️ Tables

#### `users`
| Column          | Type      | Notes                         |
|-----------------|-----------|-------------------------------|
| user_id (PK)    | SERIAL    | Unique ID for each user       |
| name            | TEXT      | User’s display name           |
| email           | TEXT      | User’s email address          |

---

#### `videos`
| Column          | Type      | Notes                         |
|-----------------|-----------|-------------------------------|
| video_id (PK)   | SERIAL    | Unique ID for each video      |
| title           | TEXT      | Title of the video            |
| description     | TEXT      | Description of the video      |
| url             | TEXT      | Video URL / storage location  |

---

#### `comments`
| Column             | Type      | Notes                                      |
|--------------------|-----------|--------------------------------------------|
| comment_id (PK)    | SERIAL    | Unique ID for each comment                 |
| video_id (FK)      | INT       | References `videos(video_id)`              |
| user_id (FK)       | INT       | References `users(user_id)`                |
| parent_comment_id  | INT (FK)  | Self-reference for replies                 |
| score              | FLOAT     | Computed engagement score (default `0`)    |
| comment_text       | TEXT      | Content of the comment                     |
| created_at         | TIMESTAMP | Default `now()`                            |

---

#### `comment_likes`
| Column            | Type      | Notes                                      |
|-------------------|-----------|--------------------------------------------|
| id (PK)           | SERIAL    | Unique ID for like/dislike action          |
| comment_id (FK)   | INT       | References `comments(comment_id)`          |
| user_id (FK)      | INT       | References `users(user_id)`                |
| like_flag         | BOOLEAN   | `true = 👍 like`, `false = 👎 dislike`     |
| created_at        | TIMESTAMP | Default `now()`                            |
| UNIQUE(comment_id, user_id) | Constraint | Prevents duplicate likes/dislikes |

---

## 📊 Comment Ranking Algorithm

Score formula (trigger-updated):


**Explanation**  
- 👍 Likes → +1 each  
- 👎 Dislikes → −1 each  
- 💬 Replies → +2 each (boost engagement)  
- ⏳ Recency bonus → newer comments get a small boost  

---

## Formula breakdown `update_comment_score` (The actual function is available in comment_db_ref.sql file)

UPDATE comments c
SET score = (
      (likes_count)
    - (dislikes_count)
    + 2 * (replies_count)
    + (1 / LOG(EXTRACT(EPOCH FROM (now() - c.created_at)) / 3600 + 2))
)
WHERE comment_id = target_id;

Likes score
COUNT(*) FROM comment_likes WHERE like_flag = true
(number of thumbs-up)

Dislikes penalty
- COUNT(*) FROM comment_likes WHERE like_flag = false
(subtract dislikes)

Replies boost
+ 2 * COUNT(*) FROM comments WHERE parent_comment_id = target_id
(each reply counts double, since replies usually indicate engagement)

Recency bonus
+ (1 / LOG(EXTRACT(EPOCH FROM (now() - c.created_at)) / 3600 + 2))

EXTRACT(EPOCH FROM (now() - c.created_at)) = how old the comment is in seconds

/ 3600 = convert to hours

LOG(... + 2) = logarithmic scaling, so freshness boost decreases over time

1 / LOG(...) = newer comments get a small bonus

## 🔥 Triggers (Postgres) & Project Structure

```sql
-- Likes (Insert/Update/Delete)
CREATE TRIGGER trg_update_score_after_like
AFTER INSERT OR UPDATE OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION update_comment_score();

-- Replies (Insert)
CREATE TRIGGER trg_update_score_after_reply_insert
AFTER INSERT ON comments
FOR EACH ROW
WHEN (NEW.parent_comment_id IS NOT NULL)
EXECUTE FUNCTION update_comment_score();

-- Replies (Delete)
CREATE TRIGGER trg_update_score_after_reply_delete
AFTER DELETE ON comments
FOR EACH ROW
WHEN (OLD.parent_comment_id IS NOT NULL)
EXECUTE FUNCTION update_comment_score();


## 🛠️ Project Structure

configurations/
  ├── cors.ts
  ├── db_config.ts
  ├── domain_list.ts
src/
  ├── controllers/    # Request handlers
  ├── interfaces/     # TypeScript DTOs
  ├── middlewares/    # Validation, error handling, etc.
  ├── routes/         # Express routes
  ├── schemas/        # Drizzle ORM models
  ├── services/       # Business logic layer
  └── server.ts       # Express entrypoint
index.ts              # Bootstrap
.env                  # Environment variables
comment_db_ref.sql    # SQL setup & triggers
