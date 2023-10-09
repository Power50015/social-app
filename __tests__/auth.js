const request = require("supertest");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const app = require("../app.js");
const bcrypt = require("bcrypt");
require("dotenv").config();

const random = Math.floor(Math.random() * 99999999) + "x";
const name = "john" + random;
const email = "john" + random + "@gmail.com";
let userId;

describe("Register Test Units", function () {
  // Preparing Unit Test
  let response, responseBody;

  it("Specify JSON in the content type header", async function () {
    // Call register URL
    response = await request(app)
      .post("/register")
      .send({
        name: name,
        email: email,
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    responseBody = response.body;
  });

  it("Respond with a 201 status code", function () {
    expect(response.status).toEqual(201);
  });

  it("Respond with a JSON object containing the user ID", function () {
    expect(typeof responseBody._id).toBe("string");
    userId = responseBody._id;
  });

  it("Save the user data to the database ", async function () {
    const user = await User.findById(userId).exec();
    expect(responseBody.name).toEqual("john" + random);
    expect(responseBody.email).toEqual("john" + random + "@gmail.com");
    expect(user.name).toEqual("john" + random);
    expect(user.email).toEqual("john" + random + "@gmail.com");
  });

  it("Test password bycrypt", async function () {
    const passwordBycrypt = await bcrypt.compare(random, responseBody.password);
    expect(passwordBycrypt).toEqual(true);
  });

  it("Respond JWT Token", function () {
    jwt.verify(responseBody.jwt, process.env.TOKEN, (err, decodedToken) => {
      if (err) {
        throw err.message;
      } else {
        expect(typeof decodedToken).toBe("object");
      }
    });
  });

  it("Testing username required", async function () {
    response = await request(app)
      .post("/register")
      .send({
        email: email,
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing email  required", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: name,
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing email  validate", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: name,
        email: "unValidate",
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing email unique", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: name,
        email: email,
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });
});

describe("Login Test Units", function () {
  let response, responseBody;

  it("Specify JSON in the content type header", async function () {
    // Call register URL
    response = await request(app)
      .post("/login")
      .send({
        email: email,
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    responseBody = response.body;
  });

  it("Respond with a 200 status code", function () {
    expect(response.status).toEqual(200);
  });

  it("Respond with a JSON object containing the user ID", function () {
    expect(typeof responseBody._id).toBe("string");
    userId = responseBody._id;
  });

  it("Respond JWT Token", function () {
    jwt.verify(responseBody.jwt, process.env.TOKEN, (err, decodedToken) => {
      if (err) {
        throw err.message;
      } else {
        expect(typeof decodedToken).toBe("object");
      }
    });
  });

  it("Testing email  required", async function () {
    response = await request(app)
      .post("/login")
      .send({
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing email  validate", async function () {
    response = await request(app)
      .post("/login")
      .send({
        email:"Un validate",
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing email doesn't exit", async function () {
    response = await request(app)
      .post("/login")
      .send({
        email: "ss"+email,
        password: random,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing password required", async function () {
    response = await request(app)
      .post("/login")
      .send({
        email: email,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });

  it("Testing wrong password", async function () {
    response = await request(app)
      .post("/login")
      .send({
        email: email,
        password:"Wrongpassword"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    expect(response.status).toEqual(400);
  });
});
