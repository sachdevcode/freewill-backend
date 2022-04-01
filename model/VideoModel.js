const passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
//schema
var videoScheme = mongoose.Schema({
 _id:{
   type: mongoose.Schema.Types.ObjectId,
 },
  video_name: {
    type: String,
  },
  title: {
    type: String,
  },
  location:{
    type:String,
  },
  subTitle: {
    type: String,
  },
  videoUploadedDate: {
    type: Date,
  },
  category: {
    type: String,
  },
  isPaid:{
      type:String,
  }
});
// Export User Model
videoScheme.plugin(passportLocalMongoose);
let VideoSchema = (module.exports = mongoose.model("video_table", videoScheme));
module.exports.get = function (callback, limit) {
  VideoSchema.find(callback).limit(limit);
};