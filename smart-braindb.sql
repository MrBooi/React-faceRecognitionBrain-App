
CREATE TABLE users (
 id serial PRIMARY KEY,
 name VARCHAR(100),
 email text UNIQUE NOT NULL,
 entries BigINT DEFAULT 0,
 joined TIMESTAMP NOT NULL

);

SELECT * FROM users;

CREATE TABLE login (
 id serial PRIMARY KEY,
 hash VARCHAR(100) not Null,
 email text UNIQUE NOT NULL
);

SELECT * FROM login;