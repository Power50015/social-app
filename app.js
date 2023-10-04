require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const router = require('./routes');

const app = express();
const port = process.env.PORT || 8085;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI).then(() => {
  console.log("DB Connected!");
  // app.listen(port, () => {
  //   console.log(`Local:   http://localhost:${port}/`);
  // });
});


app.use(router)