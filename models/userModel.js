/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    Fname: {
      type: String,
      required: [true, "Please provide your firstname"],
    },
    Lname: {
      type: String,
      required: [true, "Please provide your lastname"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        //current el (passwordConfirm) === this.password. Returns true or false
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not matching",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  //Only runs if password was modified.
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //required input, does not persist to DB.
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //return true if passwords are the same
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
