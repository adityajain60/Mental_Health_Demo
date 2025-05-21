const mongoose = require("mongoose");

const anonymousSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    options: {
      type: String,
      enum: ["happy", "sad", "depression", "adhd", "other"],
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Anonymous", anonymousSchema);
