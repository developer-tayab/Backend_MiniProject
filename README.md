# Secure User Post Platform with Node.js & MongoDB

## Project Overview

I developed a backend project where users can create accounts, log in, upload posts, and edit them. The platform is designed to be secure and easy to use, with features such as:

- **User Authentication**: Secure registration and login using JWT and bcrypt for password hashing.
- **Private Profiles**: Middleware for ensuring secure access to user accounts and posts.
- **Post Management**: Users can upload, view, and edit their posts.

## Features

- **User Account Creation**: Users can create an account using username, email, password, and age. Emails are validated to ensure unique accounts.
- **Secure Login**: Email and password-based login with error handling for incorrect login attempts.
- **Post Management**: Users can create and edit posts, which are saved securely in their accounts.
- **Security**: JWT tokens and cookie-parser are used to authenticate users securely. Passwords are hashed using bcrypt.
  
## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (JSON Web Token)**
- **bcrypt for password hashing**
- **EJS for server-side rendering**
- **Tailwind CSS for styling**

## Learnings & Challenges

- **Authentication & Authorization**: Gained hands-on experience in building a secure authentication system using JWT and bcrypt.
- **Security Measures**: Ensured that users can only create one account with a unique email and have secure login systems.
- **Middleware**: Used middleware to protect private routes and ensure that users can only access their own posts.

## Conclusion

This project allowed me to enhance my backend development skills and better understand how to manage user authentication and security in a web application.

---

**Question for You**: How do you handle user authentication and secure data storage in your projects?

