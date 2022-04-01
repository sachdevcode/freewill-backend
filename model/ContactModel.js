const passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  user_id: {
    type: String,
    required: true,
    // unique: false,
  },
  contacter_name: {
    type: String,
  },
  contacter_subject: {
    type: String,
  },
  contacter_message: {
    type: String,
  },
});

let ContactSchema = (module.exports = mongoose.model("contact", contactSchema));
module.exports.get = function (callback, limit) {
  ContactSchema.find(callback).limit(limit);
};
