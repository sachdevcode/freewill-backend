const express = require("express");

const app = express();
const { ValidateFields, ApiResponse } = require("../../helpers");
const userModel = require("../../model/UserModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());
// Set default API response
app.post("/register", (req, res) => {
  const fieldsMissing = ValidateFields(req.body, [
    "name",
    "email",
    "username",
    "password",
  ]);
  if (fieldsMissing.length) {
    res
      .status(200)
      .send(
        ApiResponse(
          {},
          `${fieldsMissing.join(", ").toString()} is missing`,
          false
        )
      );
    return false;
  }

  var user = new userModel();
  const { name, email, mobile, username, password } = req.body;
  userModel.findOne({ username: username }).then((result) => {
    if (result) {
      res.send(ApiResponse([], "User Already exist for this username", false));
    } else {
      user.name = name;
      user.email = email;
      user.mobile = mobile;
      user.username = username;
      user.isPaid = false;
      const token = jwt.sign(
        { user_id: username, email },
        process.env.SECRET_KEY,
        {
          // expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      bcrypt.hash(password, 10, (err, hash) => {
        user.password = hash;
        user.save(function (err) {
          if (err) res.send(ApiResponse(user, err, false));
          res.send(
            ApiResponse({ ...user._doc }, "User Is Created Successfully")
          );
        });
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const fieldsMissing = ValidateFields(req.body, ["username", "password"]);
  if (fieldsMissing.length) {
    res
      .status(400)
      .send(
        ApiResponse(
          {},
          `${fieldsMissing.join(", ").toString()} is missing`,
          false
        )
      );
    return false;
  }
  bcrypt.hash(password, 10, (err, hash) => {
    userModel
      .findOne({ username: username })
      .then((data) => {
        if (!data) {
          res
            .status(200)
            .send(
              ApiResponse(
                {},
                `There is no account having this username ${username}`,
                false
              )
            );
        } else if (data) {
          bcrypt.compare(password, data.password, (err, result) => {
            if (result) {
              const token = jwt.sign(
                { user_id: username, password: password },
                process.env.SECRET_KEY
              );
              res
                .status(200)
                .send(
                  ApiResponse(
                    { ...data._doc, token: token, password: undefined },
                    "Login Success",
                    true
                  )
                );
            } else {
              res
                .status(200)
                .send(ApiResponse({}, "Invalid Username or Password", true));
            }
          });
        }
      })

      .catch((err) => {
        res.status(501).send(ApiResponse({}, err, false));
      });
  });
});

// Export API routes
module.exports = app;
