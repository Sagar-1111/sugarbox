const express = require("express");
const userRoutes = require("./routes/user");
require("dotenv").config();
require("./config/database").connect();

const app = express();

app.use(express.json());

userRoutes(app);

module.exports = app;