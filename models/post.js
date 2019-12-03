const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    from: {
      type: String,
      lowercase: true,
      required: true
    },
    to: {
      type: String,
      lowercase: true,
      required: true
    },
    stoppingBy: {
      type: String,
      lowercase: true
    },
    timeOfDeparture: {
      type: String,
      required: true
    },
    pricePerPassanger: {
      type: Number,
      required: true
    },
    seats: {
      type: Number,
      required: true
    },
    confirmTwoInTheBack: {
      type: Boolean,
      default: false
    },
    extraText: {
      type: String,
      trim: true,
      max: 150
    }
  },
  { timestamps: true }
);

// create model
const Post = mongoose.model("post", postSchema);

// export model

module.exports = Post;
