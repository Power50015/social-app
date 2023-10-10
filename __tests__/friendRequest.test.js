const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app.js");
require("dotenv").config();

let random = Math.floor(Math.random() * 99999999) + "x";
const name1 = "john1" + random;
const email1 = "john1" + random + "@gmail.com";
random = Math.floor(Math.random() * 99999999) + "x";
const name2 = "john1" + random;
const email2 = "john1" + random + "@gmail.com";
let userId1, userId2;

describe("Friend Request Send Test Units", function () {
  // Preparing Unit Test
  let response1, responseBody1, response2, responseBody2;

  beforeAll(async () => {
    // Save First User
    response1 = await request(app)
      .post("/register")
      .send({
        name: name1,
        email: email1,
        password: random,
      })
      .set("Accept", "application/json");
    responseBody1 = response1.body;
    userId1 = responseBody1._id;

    // Save Second User
    response2 = await request(app)
      .post("/register")
      .send({
        name: name2,
        email: email2,
        password: random,
      })
      .set("Accept", "application/json");
    responseBody2 = response2.body;
    userId2 = responseBody2._id;

    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt}`)
      .send({
        receiverId: userId2,
      });
  });

  it("Respond with a 201 status code", function () {
    expect(friendResponse.status).toEqual(201);
  });

  it("Respond with a JSON object containing Post Data", function () {
    expect(friendResponse.headers["content-type"]).toMatch(/json/);
  });

  // it("Test if not the unique Qurey", function () {

  // });

  // it("Test if not the JWT", async function () {
  //   // Save First User
  //   response1 = await request(app)
  //     .post("/register")
  //     .send({
  //       name: name1,
  //       email: email1,
  //       password: random,
  //     })
  //     .set("Accept", "application/json");
  //   responseBody1 = response1.body;
  //   userId1 = responseBody1._id;

  //   // Save Second User
  //   response2 = await request(app)
  //     .post("/register")
  //     .send({
  //       name: name2,
  //       email: email2,
  //       password: random,
  //     })
  //     .set("Accept", "application/json");
  //   responseBody2 = response2.body;
  //   userId2 = responseBody2._id;

  //   // Send Friend Request
  //   friendResponse = await request(app)
  //     .post("/friend-request")
  //     .set("Accept", "application/json")
  //     .send({
  //       receiverId: userId2,
  //     });
  //   expect(friendResponse.status).toEqual(401);
  // });

  // it("Test if not JWT valid", async function () {

  // });

  // it("Test if JWT valid but this is not user", function () {

  // });

  // it("Test Validated Data", function () {

  // });

  // it("Specify JSON in the content type header", function () {

  // });
});
