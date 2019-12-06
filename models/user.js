const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// create schema
const userSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["local", "facebook"]
    },
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
    facebook: {
      id: {
        type: String
      },
      email: {
        type: String,
        lowercase: true
      },
      photo: {
        type: String
      },
      profileUrl: {
        type: String
      }
    },
    phoneNumber: {
      type: String,
      default: ""
    },
    firstName: String,
    lastName: String,
    passenger: {
      review: {
        rating: {
          type: Number,
          default: 0
        },
        reviews: {
          type: Number,
          default: 0
        }
      }
    },
    driver: {
      driversLicense: {
        type: String,
        default: ""
      },
      trips: {
        type: Number,
        default: 0
      },
      verified: {
        type: Boolean,
        default: false
      },
      review: {
        rating: {
          type: Number,
          default: 0
        },
        reviews: {
          type: Number,
          default: 0
        }
      }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  try {
    if (this.method !== "local") {
      next();
    }
    const salt = await bcrypt.genSalt(10);

    this.local.password = await bcrypt.hash(this.local.password, salt);
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
