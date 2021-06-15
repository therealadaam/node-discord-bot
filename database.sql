-- database name and how to setup the table for the game command
-- simply going to keep track of first loss, last loss, count of loss, and userID
CREATE DATABASE IF NOT EXISTS bot_database;

-- \c into bot_database
CREATE TABLE IF NOT EXISTS game(
	user_id BIGINT PRIMARY KEY,
	loss_count INT,
	last_loss TIMESTAMP NOT NULL,
	first_loss TIMESTAMP NOT NULL
);

INSERT INTO game(user_id,loss_count,last_loss,first_loss) VALUES(123890641468158306,1,NOW(),NOW());