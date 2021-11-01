const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../model/user');

exports.register = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
}

exports.login = async function(req, res) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

exports.delete = async function(req, res) {
  try {
    const { email } = req.body;
    if (!(email)) {
      res.status(400).send("All input is required");
    }
    await User.deleteOne({ email });
    return res.status(200).json({deleted:"ok"});
  } catch (err) {
    console.log(err);
  }
}

exports.getAllUsers = async function(req, res) {
  try {
    const { offset=0, limit=10 } = req.query;
    const users = await User.find({}, {email:1}).skip(offset).limit(limit);
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
}

exports.getUser = async function(req, res) {
  try {
    const { email } = req.query;
    const user = await User.findOne({email}, {email:1, task:1})
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}