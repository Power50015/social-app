const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app.js");
const User = require("../models/User.js");

require("dotenv").config();

let random = Math.floor(Math.random() * 99999999) + "x";
let name1 = "john1" + random;
let email1 = "john1" + random + "@gmail.com";
random = Math.floor(Math.random() * 99999999) + "x";
let name2 = "john1" + random;
let email2 = "john1" + random + "@gmail.com";
let userId1, userId2;

describe("Friend Request Send Test Units", function () {
  // Preparing Unit Test
  let response1, responseBody1, response2, responseBody2, friendResponse;

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

  it("Specify JSON in the content type header", function () {
    expect(friendResponse.headers["content-type"]).toMatch(/json/);
  });

  it("Respond with a JSON object containing Post Data", function () {
    let friendResponseData = friendResponse.body.friendRequest;
    expect(userId1).toEqual(friendResponseData.senderId);
    expect(userId2).toEqual(friendResponseData.receiverId);
  });

  it("Test if  is alrady send", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt}`)
      .send({
        receiverId: userId2,
      });
    expect(friendResponse.status).toEqual(400);
  });

  // it("Test if  is alrady a frind", function () {

  // });
  // it("Test if  is alrady a blocked", function () {

  // });

  it("Test if not the JWT", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .send({
        receiverId: userId2,
      });
    expect(friendResponse.status).toEqual(401);
  });

  it("Test if not JWT valid", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt.replace("m", "x")}`)
      .send({
        receiverId: userId1,
      });
    expect(friendResponse.status).toEqual(401);
  });

  it("Test if JWT is valid but this is not auth", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: name1 + "ss",
        email: email1 + "ss",
        password: random,
      })
      .set("Accept", "application/json");
    responseBody = response.body;
    userId = responseBody._id;
    let jwt = responseBody.jwt;
    await User.deleteOne({
      _id: userId,
    });
    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        receiverId: userId2,
      });
    expect(friendResponse.status).toEqual(401);
  });

  it("Test Validated User resver Data", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt}`)
      .send({
        receiverId: "userId2",
      });
    expect(friendResponse.status).toEqual(400);
  });
});

describe("Friend Request Get All Friend Requests Test Units", function () {
  let saveUserResponse,
    response,
    usersSenderIDs = [];
  // Preparing Unit Test
  beforeAll(async () => {
    saveUserResponse = await request(app)
      .post("/register")
      .send({
        name: name1 + "x",
        email: email1 + "x",
        password: random + "x",
      })
      .set("Accept", "application/json");

    for (let index = 0; index < 2; index++) {
      let random = Math.floor(Math.random() * 99999999) + "x";
      const name = "power" + random;
      const email = "power" + random + "@gmail.com";
      let res = await request(app)
        .post("/register")
        .send({
          name: name,
          email: email,
          password: random,
        })
        .set("Accept", "application/json");
      // Send Friend Request
      await request(app)
        .post("/friend-request")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${res.body.jwt}`)
        .send({
          receiverId: saveUserResponse.body._id,
        });
      usersSenderIDs.push(res.body._id);
    }

    response = await request(app)
      .get("/friend-request")
      .set("Authorization", `Bearer ${saveUserResponse.body.jwt}`)
      .set("Accept", "application/json");
  });

  it("Respond sd", function () {
    response.body.forEach((element) => {
      const receiverId = element.receiverId;
      const senderId = element.senderId;
      if (saveUserResponse.body._id != receiverId) {
        throw "Receiver Id not true";
      }
      if (!usersSenderIDs.includes(senderId)) {
        throw "Sender Id not true";
      }
    });
  });

  it("Respond with a 200 status code", function () {
    expect(response.status).toEqual(200);
  });

  it("Specify JSON in the content type header", function () {
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("Test if not the JWT", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .get("/friend-request")
      .set("Accept", "application/json");
    expect(friendResponse.status).toEqual(401);
  });

  it("Test if not JWT valid", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .get("/friend-request")
      .set("Accept", "application/json")
      .set(
        "Authorization",
        `Bearer ${saveUserResponse.body.jwt.replace("m", "x")}`
      );
    expect(friendResponse.status).toEqual(401);
  });
  it("Test if JWT valid but this is not user", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: "Name",
        email: "ss@eami;.com",
        password: "random123454565",
      })
      .set("Accept", "application/json");
    responseBody = response.body;
    userId = responseBody._id;
    let jwt = responseBody.jwt;
    await User.deleteOne({
      _id: userId,
    });
    // Send Friend Request
    friendResponse = await request(app)
      .get("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${jwt}`);
    expect(friendResponse.status).toEqual(401);
  });
});

describe("Testing Delete Friend Request", function () {
  // Preparing Unit Test
  let response1,
    responseBody1,
    response2,
    responseBody2,
    friendResponse,
    friendDeny;

  beforeAll(async () => {
    // Save First User
    response1 = await request(app)
      .post("/register")
      .send({
        name: "jon1" + random,
        email: "jon1" + random + "@gmail.com",
        password: random,
      })
      .set("Accept", "application/json");
    responseBody1 = response1.body;
    userId1 = responseBody1._id;

    // Save Second User
    response2 = await request(app)
      .post("/register")
      .send({
        name: "jon2" + random,
        email: "jon2" + random + "@gmail.com",
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
    friendDeny = await request(app)
      .delete("/friend-deny")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt}`)
      .send({
        requestId: friendResponse.body.friendRequest._id,
      });
  });

  it("Respond with a 201 status code", function () {
    expect(friendDeny.status).toEqual(201);
  });

  it("Specify JSON in the content type header", function () {
    expect(friendDeny.headers["content-type"]).toMatch(/json/);
  });

  it("Request ID Not Found", async function () {
    // Send Friend Request
    friendDeny = await request(app)
      .delete("/friend-deny")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt}`)
      .send({
        requestId: friendResponse.body.friendRequest._id,
      });
    expect(friendDeny.status).toEqual(400);
  });

  it("Test if not the JWT", async function () {
    // Send Friend Request
    friendResponse = await request(app)
      .post("/friend-request")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt}`)
      .send({
        receiverId: userId2,
      });
    friendDeny = await request(app)
      .delete("/friend-deny")
      .set("Accept", "application/json")
      .send({
        requestId: friendResponse.body.friendRequest._id,
      });
    expect(friendDeny.status).toEqual(401);
  });

  it("Test if not JWT valid", async function () {
    // Send Friend Request
    friendDeny = await request(app)
      .delete("/friend-deny")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${responseBody1.jwt.replace("m", "x")}`)
      .send({
        requestId: friendResponse.body.friendRequest._id,
      });
    expect(friendDeny.status).toEqual(401);
  });

  it("Test if JWT valid but this is not user", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: "Name",
        email: "ss@eami;.com",
        password: "random123454565",
      })
      .set("Accept", "application/json");
    responseBody = response.body;
    userId = responseBody._id;
    let jwt = responseBody.jwt;
    await User.deleteOne({
      _id: userId,
    });
    // Send Friend Request
    friendResponse = await request(app)
      .delete("/friend-deny")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        requestId: friendResponse.body.friendRequest._id,
      });
    expect(friendResponse.status).toEqual(401);
  });

  it("User not sender or resiver", async function () {
    response = await request(app)
      .post("/register")
      .send({
        name: "Name",
        email: "ss@eami;.com",
        password: "random123454565",
      })
      .set("Accept", "application/json");
    responseBody = response.body;
    userId = responseBody._id;
    let jwt = responseBody.jwt;
    // Send Friend Request
    friendResponse = await request(app)
      .delete("/friend-deny")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        requestId: responseBody1._id,
      });
    expect(friendResponse.status).toEqual(401);
  });
});
