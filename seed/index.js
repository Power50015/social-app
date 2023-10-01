require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI).then(() => {

    
});

