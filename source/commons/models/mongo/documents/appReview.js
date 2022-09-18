const mongoose = require("mongoose");
const { crypto, datetime } = require("./../../../util/UtilManager");

const AppReviewSchema = mongoose.Schema({
  _id: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  reviewTitle: String,
  reviewDescription: String,
  reviewDate: Date,
  reviewNoOfLikes: Number,
  likes: [String],
  reviewedUserId: String,
  reviewedUserName: String,
  reviewedUserMail: String,
  reviewedUserMobile: String,
});

//Adding middlewares
AppReviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  console.log(this.likes.length);
  this.reviewNoOfLikes = this.likes.length;
  next();
});

module.exports = mongoose.model("AppReview", AppReviewSchema, "AppReview");
