const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// create schema
const userSchema = new Schema({
  local: {
    email: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  firstName: String,
  lastName: String,
  lastName: String,
  number: Number,
  rating: Number,
  reviews: Number
});

userSchema.pre("save", async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(this.local.password, salt);

    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.authenticate = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

// create model
const User = mongoose.model("user", userSchema);

// export model

module.exports = User;
