--
-- PostgreSQL database dump
--

\restrict PUQ0mwvsAkmrqh4JCVIhYSHrHZGPETPhWJG5dxYjFz3Pm6DNecvgvbFZlIccZUy

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: update_comment_score(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_comment_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  -- An array to collect all comment IDs that need score recalculation
  targets integer[] := ARRAY[]::integer[];

  -- A single comment ID used during iteration
  target_id integer;
BEGIN
  -------------------------------------------------------------------
  -- 1. Determine which comment(s) are affected based on the table
  -------------------------------------------------------------------

  IF TG_TABLE_NAME = 'comment_likes' THEN
    -- A row in comment_likes represents a like/dislike on a comment.

    IF TG_OP = 'INSERT' THEN
      -- New like/dislike ? recalc that comment
      targets := ARRAY[NEW.comment_id];

    ELSIF TG_OP = 'DELETE' THEN
      -- A like/dislike removed ? recalc that comment
      targets := ARRAY[OLD.comment_id];

    ELSIF TG_OP = 'UPDATE' THEN
      -- A like/dislike updated (could be comment_id change or flag change)
      IF OLD.comment_id IS DISTINCT FROM NEW.comment_id THEN
        -- The like moved from one comment to another ? update both
        targets := ARRAY[OLD.comment_id, NEW.comment_id];
      ELSE
        -- Same comment, but flag changed (like ? dislike) ? update once
        targets := ARRAY[NEW.comment_id];
      END IF;
    END IF;

  ELSIF TG_TABLE_NAME = 'comments' THEN
    -- A row in comments may itself be a reply to another comment.
    -- Only replies matter for parent score updates (parent_comment_id NOT NULL).

    IF TG_OP = 'INSERT' THEN
      -- New reply ? update parent comment score
      IF NEW.parent_comment_id IS NOT NULL THEN
        targets := ARRAY[NEW.parent_comment_id];
      END IF;

    ELSIF TG_OP = 'DELETE' THEN
      -- Reply deleted ? update parent comment score
      IF OLD.parent_comment_id IS NOT NULL THEN
        targets := ARRAY[OLD.parent_comment_id];
      END IF;

    ELSIF TG_OP = 'UPDATE' THEN
      -- Reply moved from one parent to another
      IF OLD.parent_comment_id IS DISTINCT FROM NEW.parent_comment_id THEN
        -- Update both old parent and new parent scores
        IF OLD.parent_comment_id IS NOT NULL THEN
          targets := targets || OLD.parent_comment_id;
        END IF;
        IF NEW.parent_comment_id IS NOT NULL THEN
          targets := targets || NEW.parent_comment_id;
        END IF;
      ELSE
        -- Parent didn’t change ? update the same parent once
        IF NEW.parent_comment_id IS NOT NULL THEN
          targets := ARRAY[NEW.parent_comment_id];
        END IF;
      END IF;
    END IF;

  ELSE
    -- Safety: If this function is ever mistakenly attached to another table
    RETURN NULL;
  END IF;

  -------------------------------------------------------------------
  -- 2. Normalize target list (remove NULLs and duplicates)
  -------------------------------------------------------------------
  targets := (
    SELECT array_agg(DISTINCT x)
    FROM unnest(targets) AS x(x)
    WHERE x IS NOT NULL
  );

  -- If nothing to update, just return
  IF targets IS NULL THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  -------------------------------------------------------------------
  -- 3. Recompute score for each affected comment
  -------------------------------------------------------------------
  FOREACH target_id IN ARRAY targets LOOP
    UPDATE comments c
    SET score = (
        -- Likes count
        COALESCE((SELECT COUNT(*) FROM comment_likes cl
                  WHERE cl.comment_id = target_id AND cl.like_flag = true), 0)
        -- Minus dislikes count
      - COALESCE((SELECT COUNT(*) FROM comment_likes cl
                  WHERE cl.comment_id = target_id AND cl.like_flag = false), 0)
        -- Plus reply count * 2 (replies weigh more)
      + 2 * COALESCE((SELECT COUNT(*) FROM comments r
                      WHERE r.parent_comment_id = target_id), 0)
        -- Plus recency boost (newer comments score higher)
      + (1 / LOG(EXTRACT(EPOCH FROM (now() - c.created_at)) / 3600 + 2))
    )
    WHERE c.comment_id = target_id;
  END LOOP;

  -------------------------------------------------------------------
  -- 4. Return correct row type depending on trigger operation
  -------------------------------------------------------------------
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;  -- For DELETE triggers, return OLD row
  ELSE
    RETURN NEW;  -- For INSERT/UPDATE triggers, return NEW row
  END IF;
END;
$$;


ALTER FUNCTION public.update_comment_score() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comment_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_likes (
    like_id integer NOT NULL,
    comment_id integer NOT NULL,
    user_id integer NOT NULL,
    like_flag boolean NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comment_likes OWNER TO postgres;

--
-- Name: comment_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_likes_id_seq OWNER TO postgres;

--
-- Name: comment_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_likes_id_seq OWNED BY public.comment_likes.like_id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    video_id integer NOT NULL,
    user_id integer NOT NULL,
    parent_comment_id integer,
    comment_text text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    score double precision DEFAULT 0
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_comment_id_seq OWNER TO postgres;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    video_id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- Name: videos_video_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.videos_video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_video_id_seq OWNER TO postgres;

--
-- Name: videos_video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.videos_video_id_seq OWNED BY public.videos.video_id;


--
-- Name: comment_likes like_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_likes ALTER COLUMN like_id SET DEFAULT nextval('public.comment_likes_id_seq'::regclass);


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: videos video_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos ALTER COLUMN video_id SET DEFAULT nextval('public.videos_video_id_seq'::regclass);


--
-- Name: comment_likes comment_likes_comment_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_user_id_key UNIQUE (comment_id, user_id);


--
-- Name: comment_likes comment_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_pkey PRIMARY KEY (like_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (video_id);


--
-- Name: comment_likes trg_update_score_after_like; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_score_after_like AFTER INSERT OR DELETE OR UPDATE ON public.comment_likes FOR EACH ROW EXECUTE FUNCTION public.update_comment_score();


--
-- Name: comments trg_update_score_after_reply_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_score_after_reply_delete AFTER DELETE ON public.comments FOR EACH ROW WHEN ((old.parent_comment_id IS NOT NULL)) EXECUTE FUNCTION public.update_comment_score();


--
-- Name: comments trg_update_score_after_reply_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_score_after_reply_insert AFTER INSERT ON public.comments FOR EACH ROW WHEN ((new.parent_comment_id IS NOT NULL)) EXECUTE FUNCTION public.update_comment_score();


--
-- Name: comment_likes comment_likes_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id);


--
-- Name: comment_likes comment_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: comments comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(comment_id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: comments comments_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(video_id);


--
-- PostgreSQL database dump complete
--

\unrestrict PUQ0mwvsAkmrqh4JCVIhYSHrHZGPETPhWJG5dxYjFz3Pm6DNecvgvbFZlIccZUy

