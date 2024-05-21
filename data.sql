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

-- Insert mock data into users table
INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) VALUES
('jdoe', 'password123', 'John', 'Doe', '123-456-7890', '2024-01-01 10:00:00', '2024-05-01 12:00:00'),
('asmith', 'password456', 'Alice', 'Smith', '987-654-3210', '2024-02-15 08:30:00', '2024-05-10 15:45:00'),
('bwhite', 'password789', 'Bob', 'White', '456-789-0123', '2024-03-20 09:15:00', '2024-05-15 14:30:00'),
('cjones', 'password321', 'Carol', 'Jones', '789-012-3456', '2024-04-10 11:45:00', '2024-05-20 10:20:00'),
('dlee', 'passwordabc', 'David', 'Lee', '321-654-0987', '2024-05-01 07:50:00', '2024-05-18 08:00:00'),
('ewilliams', 'passworddef', 'Emma', 'Williams', '159-753-4862', '2024-05-03 10:25:00', '2024-05-18 09:10:00'),
('fgarcia', 'passwordghi', 'Frank', 'Garcia', '951-357-6248', '2024-05-05 12:45:00', '2024-05-19 11:25:00'),
('gharris', 'passwordjkl', 'Grace', 'Harris', '753-951-8524', '2024-05-07 14:15:00', '2024-05-20 13:00:00'),
('hmartin', 'passwordmno', 'Hannah', 'Martin', '654-123-7890', '2024-05-09 16:30:00', '2024-05-21 15:45:00');

-- Insert mock data into messages table
INSERT INTO messages (from_username, to_username, body, sent_at, read_at) VALUES
('jdoe', 'asmith', 'Hello Alice, how are you?', '2024-05-18 09:00:00-07', '2024-05-18 09:05:00-07'),
('asmith', 'jdoe', 'Hi John, I am good. How about you?', '2024-05-18 09:10:00-07', '2024-05-18 09:12:00-07'),
('bwhite', 'cjones', 'Hey Carol, are you coming to the meeting?', '2024-05-19 14:00:00-07', NULL),
('cjones', 'bwhite', 'Hi Bob, yes I will be there.', '2024-05-19 14:30:00-07', '2024-05-19 14:35:00-07'),
('jdoe', 'cjones', 'Carol, can we discuss the project tomorrow?', '2024-05-20 08:00:00-07', NULL),
('cjones', 'jdoe', 'Sure John, let’s meet at 10 AM.', '2024-05-20 08:30:00-07', NULL),
-- Additional messages with dates from 2022 to 2023
('dlee', 'ewilliams', 'Hello Emma, can you review the document?', '2022-01-15 10:30:00-07', '2022-01-15 10:45:00-07'),
('ewilliams', 'dlee', 'Hi David, I have reviewed it. Looks good.', '2022-01-15 11:00:00-07', '2022-01-15 11:10:00-07'),
('fgarcia', 'gharris', 'Grace, can you send me the report?', '2022-02-20 09:00:00-07', NULL),
('gharris', 'fgarcia', 'Sure Frank, I will send it by noon.', '2022-02-20 09:15:00-07', '2022-02-20 09:20:00-07'),
('hmartin', 'jdoe', 'John, did you finish the task?', '2022-03-10 14:00:00-07', NULL),
('jdoe', 'hmartin', 'Yes, Hannah. I finished it yesterday.', '2022-03-10 14:30:00-07', '2022-03-10 14:35:00-07'),
('asmith', 'bwhite', 'Bob, can we reschedule our meeting?', '2022-04-25 16:00:00-07', '2022-04-25 16:10:00-07'),
('bwhite', 'asmith', 'Sure Alice, let’s meet tomorrow at 10 AM.', '2022-04-25 16:30:00-07', NULL),
('cjones', 'ewilliams', 'Emma, please send me the updated file.', '2022-05-15 13:00:00-07', '2022-05-15 13:05:00-07'),
('ewilliams', 'cjones', 'Carol, I have sent it to your email.', '2022-05-15 13:10:00-07', NULL),
('dlee', 'gharris', 'Grace, can we discuss the budget report?', '2022-06-05 11:00:00-07', '2022-06-05 11:10:00-07'),
('gharris', 'dlee', 'David, let’s discuss it after lunch.', '2022-06-05 11:30:00-07', '2022-06-05 11:35:00-07'),
('fgarcia', 'hmartin', 'Hannah, please review the attached document.', '2022-07-20 10:00:00-07', '2022-07-20 10:15:00-07'),
('hmartin', 'fgarcia', 'Frank, I have reviewed it. No issues found.', '2022-07-20 10:30:00-07', NULL),
('jdoe', 'ewilliams', 'Emma, can you join the team call tomorrow?', '2022-08-15 15:00:00-07', '2022-08-15 15:05:00-07'),
('ewilliams', 'jdoe', 'John, yes I will join the call.', '2022-08-15 15:10:00-07', '2022-08-15 15:15:00-07'),
('asmith', 'dlee', 'David, can you share the project plan?', '2022-09-10 09:00:00-07', NULL),
('dlee', 'asmith', 'Alice, I have shared the project plan.', '2022-09-10 09:30:00-07', '2022-09-10 09:35:00-07'),
('bwhite', 'gharris', 'Grace, do you have the latest report?', '2022-10-05 12:00:00-07', '2022-10-05 12:05:00-07'),
('gharris', 'bwhite', 'Yes Bob, I will send it to you.', '2022-10-05 12:10:00-07', '2022-10-05 12:15:00-07'),
('cjones', 'hmartin', 'Hannah, can we discuss the new project?', '2022-11-20 14:00:00-07', NULL),
('hmartin', 'cjones', 'Carol, let’s meet tomorrow at 3 PM.', '2022-11-20 14:30:00-07', '2022-11-20 14:35:00-07'),
('jdoe', 'fgarcia', 'Frank, can you provide an update on the task?', '2022-12-10 16:00:00-07', '2022-12-10 16:05:00-07'),
('fgarcia', 'jdoe', 'John, I will send you the update by EOD.', '2022-12-10 16:30:00-07', '2022-12-10 16:35:00-07'),
('asmith', 'gharris', 'Grace, can you review the presentation slides?', '2023-01-15 10:00:00-07', '2023-01-15 10:05:00-07'),
('gharris', 'asmith', 'Alice, I have reviewed them. Looks good.', '2023-01-15 10:30:00-07', '2023-01-15 10:35:00-07'),
('bwhite', 'hmartin', 'Hannah, can you provide feedback on the proposal?', '2023-02-20 09:00:00-07', NULL),
('hmartin', 'bwhite', 'Bob, I will review it and share my feedback.', '2023-02-20 09:30:00-07', '2023-02-20 09:35:00-07'),
('cjones', 'jdoe', 'John, can you update the project timeline?', '2023-03-10 14:00:00-07', NULL),
('jdoe', 'cjones', 'Carol, I have updated the timeline. Please review.', '2023-03-10 14:30:00-07', '2023-03-10 14:35:00-07'),
('dlee', 'asmith', 'Alice, can we discuss the budget allocation?', '2023-04-25 16:00:00-07', '2023-04-25 16:05:00-07'),
('asmith', 'dlee', 'David, let’s discuss it in the next meeting.', '2023-04-25 16:30:00-07', '2023-04-25 16:35:00-07'),
('dlee', 'fgarcia', 'Frank, did you get my last email?', '2022-12-15 08:00:00-07', '2022-12-15 08:05:00-07'),
('fgarcia', 'dlee', 'Yes David, I got it. Thanks!', '2022-12-15 08:10:00-07', NULL),
('ewilliams', 'hmartin', 'Hannah, can you send me the presentation?', '2022-12-20 10:00:00-07', '2022-12-20 10:05:00-07'),
('hmartin', 'ewilliams', 'Sure Emma, I will send it shortly.', '2022-12-20 10:15:00-07', '2022-12-20 10:20:00-07'),
('jdoe', 'dlee', 'David, are you free for a call?', '2023-01-10 14:00:00-07', '2023-01-10 14:05:00-07'),
('dlee', 'jdoe', 'Yes John, I am available now.', '2023-01-10 14:10:00-07', '2023-01-10 14:15:00-07'),
('asmith', 'gharris', 'Grace, can you update the spreadsheet?', '2023-02-15 11:00:00-07', '2023-02-15 11:05:00-07'),
('gharris', 'asmith', 'Sure Alice, I will update it.', '2023-02-15 11:10:00-07', NULL),
('bwhite', 'ewilliams', 'Emma, can we discuss the sales report?', '2023-03-20 16:00:00-07', '2023-03-20 16:05:00-07'),
('ewilliams', 'bwhite', 'Yes Bob, let’s discuss it now.', '2023-03-20 16:10:00-07', '2023-03-20 16:15:00-07'),
('cjones', 'asmith', 'Alice, did you finish the review?', '2023-04-25 09:00:00-07', '2023-04-25 09:05:00-07'),
('asmith', 'cjones', 'Yes Carol, I finished it yesterday.', '2023-04-25 09:10:00-07', NULL),
('dlee', 'bwhite', 'Bob, can you send me the latest data?', '2023-05-15 12:00:00-07', '2023-05-15 12:05:00-07'),
('bwhite', 'dlee', 'Sure David, I will send it now.', '2023-05-15 12:10:00-07', '2023-05-15 12:15:00-07'),
('ewilliams', 'cjones', 'Carol, can we meet tomorrow?', '2023-06-10 14:00:00-07', NULL),
('cjones', 'ewilliams', 'Yes Emma, let’s meet at 2 PM.', '2023-06-10 14:30:00-07', '2023-06-10 14:35:00-07'),
('gharris', 'hmartin', 'Hannah, did you receive my message?', '2023-07-20 08:00:00-07', '2023-07-20 08:05:00-07'),
('hmartin', 'gharris', 'Yes Grace, I received it.', '2023-07-20 08:10:00-07', '2023-07-20 08:15:00-07'),
('jdoe', 'asmith', 'Alice, can you join the call at 3 PM?', '2023-08-25 15:00:00-07', '2023-08-25 15:05:00-07'),
('asmith', 'jdoe', 'Yes John, I will join the call.', '2023-08-25 15:10:00-07', NULL),
('fgarcia', 'dlee', 'David, did you get the files I sent?', '2023-09-10 10:00:00-07', '2023-09-10 10:05:00-07'),
('dlee', 'fgarcia', 'Yes Frank, I got them. Thanks!', '2023-09-10 10:10:00-07', NULL),
('ewilliams', 'jdoe', 'John, can you review the new proposal?', '2023-10-15 13:00:00-07', '2023-10-15 13:05:00-07'),
('jdoe', 'ewilliams', 'Sure Emma, I will review it today.', '2023-10-15 13:10:00-07', NULL),
('gharris', 'cjones', 'Carol, are you available for a quick chat?', '2023-11-20 11:00:00-07', '2023-11-20 11:05:00-07'),
('cjones', 'gharris', 'Yes Grace, let’s chat now.', '2023-11-20 11:10:00-07', '2023-11-20 11:15:00-07'),
('hmartin', 'asmith', 'Alice, can you send me the latest report?', '2023-12-15 16:00:00-07', '2023-12-15 16:05:00-07'),
('asmith', 'hmartin', 'Sure Hannah, I will send it right away.', '2023-12-15 16:10:00-07', NULL);

-- Create indexes for the messages table
CREATE INDEX messages_from_username_idx ON public.messages USING btree (from_username);
CREATE INDEX messages_to_username_idx ON public.messages USING btree (to_username);
CREATE INDEX messages_sent_at_idx ON public.messages USING btree (sent_at);