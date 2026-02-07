CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
--@block
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
--@block
INSERT INTO users (username, email, password_hash)
VALUES ('test_user', 'test_user@gmail.com', 'test_user');

INSERT INTO posts (user_id, image_url, caption)
VALUES (1, 'something.jpg', 'first creation');
--@block
SELECT users.username, posts.caption
FROM posts
JOIN users ON posts.user_id = users.id;
