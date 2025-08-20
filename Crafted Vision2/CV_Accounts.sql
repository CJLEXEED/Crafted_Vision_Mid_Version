-- Create the CV_Accounts database
CREATE DATABASE CV_Accounts;

-- Use the CV_Accounts database
USE CV_Accounts;

-- Table: Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique user ID
    username VARCHAR(50) NOT NULL UNIQUE,    -- Username (unique)
    email VARCHAR(100) NOT NULL UNIQUE,      -- Email (unique)
    password_hash VARCHAR(255) NOT NULL,     -- Hashed password
    first_name VARCHAR(50),                  -- First name
    last_name VARCHAR(50),                   -- Last name
    profile_picture_url VARCHAR(255),        -- Optional profile picture URL
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Account creation timestamp
    last_login TIMESTAMP                     -- Last login timestamp
);

-- Table: Roles
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique role ID
    role_name VARCHAR(50) NOT NULL UNIQUE    -- Role name (e.g., 'admin', 'user')
);

-- Table: UserRoles (Many-to-Many Relationship between Users and Roles)
CREATE TABLE UserRoles (
    user_role_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for this relationship
    user_id INT NOT NULL,                         -- User ID (foreign key)
    role_id INT NOT NULL,                         -- Role ID (foreign key)
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

-- Table: Sessions
CREATE TABLE Sessions (
    session_id CHAR(36) PRIMARY KEY,             -- Unique session ID (UUID)
    user_id INT NOT NULL,                        -- User ID (foreign key)
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Login timestamp
    logout_time TIMESTAMP,                       -- Logout timestamp
    session_token VARCHAR(255) UNIQUE,          -- Token for session management
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Table: PasswordResets
CREATE TABLE PasswordResets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,    -- Unique reset request ID
    user_id INT NOT NULL,                       -- User ID (foreign key)
    reset_token VARCHAR(255) UNIQUE,           -- Unique reset token
    expiration_time TIMESTAMP,                 -- Token expiration time
    is_used BOOLEAN DEFAULT FALSE,             -- Whether the token has been used
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Insert Default Roles
INSERT INTO Roles (role_name) VALUES
('admin'),
('user');
