const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/server"); // Assuming your server.js exports the app
const faker = require("faker");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const expect = chai.expect;

const newUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe("User API", () => {
  let testToken;
  let testUserId;


  // Register a test user and get a valid token
  before(async () => {
    const newUser = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await chai
      .request(server)
      .post("/api/users/register")
      .send(newUser);
    expect(res).to.have.status(201);
    testToken = res.body.token;
    testUserId = jwt.verify(testToken, process.env.JWT_SECRET).userId;
  });

  describe("User Registration", () => {
    it("should register a new user with valid data", (done) => {
      chai
        .request(server)
        .post("/api/users/register")
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("should return an error for duplicate email", (done) => {
      chai
        .request(server)
        .post("/api/users/register")
        .send({
          id: testUserId,
          username: "duplicateuser",
          email: newUser.email, // Same email as the test user
          password: "password123",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property("message")
            .that.includes("Email already registered");
          done();
        });
    });

    // ... (add more tests for missing fields, invalid email format, etc.)
  });

  describe("User Login", () => {
    it("should log in a user with valid credentials", (done) => {
      const credentials = {
        email: newUser.email,
        password: newUser.password,
      };
      chai
        .request(server)
        .post("/api/users/login")
        .send(credentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("should return an error for invalid credentials", (done) => {
      const invalidCredentials = {
        email: newUser.email,
        password: "wrongpassword",
      };
      // ... (similar structure as above, assert for 401 status code)
      chai
        .request(server)
        .post("/api/users/login")
        .send(invalidCredentials)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("message").that.includes("Invalid");
          done();
        });
    });
  });

  

describe("Get User", () => {
  it("should get a user by ID with authorization", (done) => {
    chai
      .request(server)
      .get(`/api/users/${testUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id", testUserId);
        // ... assert other user properties (username, email, etc.) based on your API response
        done();
      });
  });

  it("should return an error for unauthorized access", (done) => {
    chai
      .request(server)
      .get(`/api/users/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message", "Unauthorized"); // Or your specific error message
        done();
      });
  });

  it("should return an error for invalid user ID", (done) => {
    const invalidUserId = 9999; // Assuming this ID doesn't exist
    chai
      .request(server)
      .get(`/api/users/${invalidUserId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "User not found"); // Or your specific error message
        done();
      });
  });
});

  describe("Update User", () => {
    it("should update a user with valid data and authorization", (done) => {
      const updates = {
        username: "updateduser",
        email: "kjhupdated@example.com",
        password: "updatedpassword",
      };

      chai
        .request(server)
        .put(`/api/users/${testUserId}`) // Use the actual testUserId
        .set("Authorization", `Bearer ${testToken}`)
        .send(updates)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property("message")
            .that.includes("User updated successfully");
          // You might want to make a GET request to verify the update in the database
          done();
        });
    });

    it("should return 403 for unauthorized user update", (done) => {
      const updates = {
        username: "unauthorized_update",
        email: "unauthorized@example.com",
        password: "unauthorizedpassword",
      };

      // Create a new user to try and update
      chai
        .request(server)
        .post("/api/users/register")
        .send({
          username: "unauthorized_user",
          email: "unauthorized@example.com",
          password: "unauthorizedpassword",
        })
        .end(async (err, res) => {
          expect(res).to.have.status(201);
          const unauthorizedUserId = jwt.verify(
            res.body.token,
            process.env.JWT_SECRET
          ).userId;

          // Try to update the unauthorized user's account
          chai
            .request(server)
            .put(`/api/users/${unauthorizedUserId}`)
            .set("Authorization", `Bearer ${testToken}`)
            .send(updates)
            .end((err, res) => {
              expect(res).to.have.status(403);
              expect(res.body)
                .to.have.property("message")
                .that.includes("Not authorized to update this user");
              done();
            });
        });
      done();
    });
  });
  describe("Delete User", () => {
    it("should delete a user with authorization", (done) => {
      chai
        .request(server)
        .delete(`/api/users/${testUserId}`) // Use the actual testUserId
        .set("Authorization", `Bearer ${testToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property("message")
            .that.includes("User deleted successfully");
          done();
        });
    });

    it("should return 403 for unauthorized user deletion", (done) => {
      // Create a new user to try and delete
      chai
        .request(server)
        .post("/api/users/9999999")

        .end(async (err, res) => {
          expect(res).to.have.status(403);
          const unauthorizedUserId = jwt.verify(
            res.body.token,
            process.env.JWT_SECRET
          ).userId;
        });
      done();
    });
  });
});
