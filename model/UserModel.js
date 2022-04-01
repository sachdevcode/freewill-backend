const passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
//schema
var userScheme = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  isPaid: {
    type: Boolean,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
// Export User Model
userScheme.plugin(passportLocalMongoose);
let User = (module.exports = mongoose.model("user_table", userScheme));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};