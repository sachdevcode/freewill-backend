const express = require("express");
const FirebaseStorage = require("multer-firebase-storage");
const firebaseAdmin = require("firebase-admin");
const mongoose = require("mongoose");

const VideoSchema = require("../../model/VideoModel");
const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
const app = express();

var multer = require("multer");
var upload = multer({
  // storage: "uploads/",
  storage: FirebaseStorage({
    bucketName: process.env.BUCKET_NAME,
    credentials: {
      type: "service_account",
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PROJECT_KEY_ID,
      private_key: privateKey,
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_CERT_URL,
    },
    public: true,
    namePrefix: new Date().toString(),
  }),
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
      fileName: `${new Date().toUTCString()}${file?.originalname}`,
    });
  },
  key: function (req, file, cb) {
    cb(null, `${new Date().toUTCString()}${file?.originalname}`);
  },
});

// Set default API response
app.post("/upload", upload.single("avatar"), (req, res) => {
  const {
    name,
    title,
    subTitle,
    uploadedDate,
    category,
    isPaid = false,
  } = req.body;
  const videoSchema = VideoSchema();
  videoSchema._id = new mongoose.Types.ObjectId();
  videoSchema.video_name = name || "";
  videoSchema.title = title || "";
  videoSchema.username = new mongoose.Types.ObjectId();
  videoSchema.location = req?.file?.fileRef?.metadata?.mediaLink || {};
  videoSchema.subTitle = subTitle || "";
  videoSchema.videoUploadedDate = new Date();
  videoSchema.category = category || "";
  videoSchema.isPaid = isPaid;

  videoSchema.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send({
        status: true,
        message: "Video Uploaded Successfully",
        date: { ...videoSchema._doc },
      });
    }
  });
});

app.get("/free", (req, res) => {
  let filter = { isPaid: false };
  if (req?.query?.category) {
    filter = { isPaid: false, category: req?.query?.category };
  } else {
    filter = { isPaid: false };
  }
  VideoSchema.find(filter).then((data) => {
    res.status(200).send({
      status: true,
      message: "Free Videos fetched sucessfully",
      data: data,
    });
  });
});

app.get("/premium", (req, res) => {
  let filter = { isPaid: true };
  if (req?.query?.category) {
    filter = { isPaid: true, category: req?.query?.category };
  } else {
    filter = { isPaid: true };
  }
  VideoSchema.find(filter)
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "Premium Videos fetched sucessfully",
        data: data,
      });
    })
    .catch((err) => res.send(err));
});

// Export API routes
module.exports = app;
