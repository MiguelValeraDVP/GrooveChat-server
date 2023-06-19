const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already in use", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already in use", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Invalid credentials", status: false });
    }

    const passwordValidation = await bcrypt.compare(password, user.password);

    if (!passwordValidation) {
      return res.json({ msg: "Invalid credentials", status: false });
    }

    jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
      res.json({ status: true, user, token });
    });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const avatarImage = req.body.image;
    console.log(avatarImage);

    const userData = await User.findByIdAndUpdate(
      userId,
      { isAvatarSet: true, avatarImage },
      { new: true }
    );

    console.log(userData);
    return res.json({ userData });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const userId = req.params.id;

    let users = await User.find().select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    users = users.filter((user) => !user._id.equals(new ObjectId(userId)));

    res.json(users);
  } catch (ex) {
    next(ex);
  }
};
