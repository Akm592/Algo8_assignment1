# Blog API - README

## Overview

This is a RESTful API built with Node.js and MySQL for managing a simple blog application. The API provides endpoints for user authentication, creating, reading, updating, and deleting blog posts, and basic user management.

## Technologies

- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/your-repo-name.git
```

2. **Install dependencies:**

```
cd your-repo-name
npm install
```

3. **Set up the environment:**
   - Create a .env file in the root directory of the project.
   - Add the following environment variables to the .env file, replacing the placeholders with your actual values:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
```

4. **Create the database schema:**
   - Run the provided SQL script to create the necessary tables in your MySQL database. (e.g., `./schema/schema.sql`)

5. **Start the server:**

```
npm start
```

## API Documentation

### Authentication

#### Register:

- Endpoint: `POST /api/users/register`
- Body:
  ```json
  {
    "username": "your_username",
    "email": "your_email@example.com",
    "password": "your_password"
  }
  ```
- Response:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

#### Login:

- Endpoint: `POST /api/users/login`
- Body:
  ```json
  {
    "email": "your_email@example.com",
    "password": "your_password"
  }
  ```
- Response:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### Blog Posts

#### Create Post (requires authentication):

- Endpoint: `POST /api/posts`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```
- Body:
  ```json
  {
    "title": "Your Post Title",
    "content": "Your post content goes here..."
  }
  ```

#### Get All Posts:

- Endpoint: `GET /api/posts`

#### Get Post by ID:

- Endpoint: `GET /api/posts/:id`

#### Update Post (requires authentication):

- Endpoint: `PUT /api/posts/:id`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```
- Body:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content..."
  }
  ```

#### Delete Post (requires authentication):

- Endpoint: `DELETE /api/posts/:id`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```

### Users (for future implementation)

#### Get User by ID (requires authentication):

- Endpoint: `GET /api/users/:id`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```

#### Update User (requires authentication):

- Endpoint: `PUT /api/users/:id`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```

#### Delete User (requires authentication):

- Endpoint: `DELETE /api/users/:id`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact: **ashishkumarmishra952@gmail.com**
