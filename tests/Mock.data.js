const mockUsers = [
  {
    id: 1,
    username: "testuser1",
    email: "test1@example.com",
    password: "password123",
  },
  {
    id: 2,
    username: "testuser2",
    email: "test2@example.com",
    password: "anotherpassword",
  },
  // Add more mock users as needed
];

const mockNewUser = {
  username: "newuser",
  email: "newuser@example.com",
  password: "newpassword",
};

const mockUpdateUser = {
  username: "updateduser",
  email: "updatedemail@example.com",
};

const mockPosts = [
  {
    id: 1,
    title: "My First Blog Post",
    content: "This is the content of my first blog post.",
    authorId: 1,
  },
  {
    id: 2,
    title: "Another Interesting Post",
    content: "More insightful content here...",
    authorId: 2,
  },
  // Add more mock posts as needed
];

const mockNewPost = {
  title: "Brand New Post",
  content: "This is a brand new post!",
  authorId: 1,
};

const mockUpdatePost = {
  title: "Updated Title",
  content: "This content has been updated.",
};

const mockCreateResponse = { insertId: 3 }; // Assuming the new ID is 3
const mockUpdateResponse = { affectedRows: 1 }; // Indicates successful update

module.exports = {
  mockUsers,
  mockNewUser,
  mockUpdateUser,
  mockPosts,
  mockNewPost,
  mockUpdatePost,
  mockCreateResponse,
  mockUpdateResponse,
};
