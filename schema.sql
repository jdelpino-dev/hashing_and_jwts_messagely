\c messagely-test;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

-- Create the messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users(username),
    to_username text NOT NULL REFERENCES users(username),
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

-- Create indexes for the messages table
CREATE INDEX messages_from_username_idx ON public.messages USING btree (from_username);
CREATE INDEX messages_to_username_idx ON public.messages USING btree (to_username);
CREATE INDEX messages_sent_at_idx ON public.messages USING btree (sent_at);