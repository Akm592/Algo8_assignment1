// src/models/post.model.js
class Post {
  constructor(id, title, content, user_id, createdAt = new Date()) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.user_id = user_id;
    this.createdAt = createdAt;
  }

    toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      user_id: this.user_id,
      createdAt: this.createdAt,
      // Include any other relevant properties here
    };
  }
}

module.exports = Post;
