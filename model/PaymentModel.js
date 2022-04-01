const passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
//schema
var paymentScheme = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
// Export User Model
let User = (module.exports = mongoose.model("payment_table", paymentScheme));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};