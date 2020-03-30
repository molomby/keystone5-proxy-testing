-- Create tables
CREATE TABLE public."User" (
    id integer NOT NULL,
    email text,
    password character varying(60)
);

CREATE SEQUENCE public."User_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
ALTER TABLE ONLY public."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);

-- Seed data
insert into public."User" (email, password) values ('john@thinkmill.com.au', '$2a$12$MzRWYxXmKPhzntxLpiXwk.yMW3ToUqbKJ5a.FjlyxuN29AFnNkEbm');
