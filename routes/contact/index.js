const express = require("express");

const app = express();
const passport = require("passport");
const auth = require("../../middleware/auth");
const contactSchema = require("../../model/ContactModel");
const mongoose = require("mongoose");

app.use(passport.initialize());
app.use(passport.session());
// Set default API response
app.post("/", auth, (req, res) => {
  const { user_id } = req.user;
  const { name, subject, message } = req.body;
  const contactScheme = new contactSchema();
  contactScheme._id = new mongoose.Types.ObjectId();
  contactScheme.user_id = user_id;
  contactScheme.contact_created_at = new Date();
  contactScheme.contacter_name = name;
  contactScheme.contacter_subject = subject;
  contactScheme.contacter_message = message;
  contactScheme.save((err) => {
    if (err) throw err;
    res.status(201).send({
      status: true,
      message: "Contact form submitted",
      data: { ...contactScheme._doc },
    });
  });
});

module.exports = app;
