const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });

const userRoutes = require("./routes/user");
const videoRoutes = require("./routes/videos");
const paymentRoutes = require("./routes/payment");
const contactRoutes = require("./routes/contact");
const connection = require("./config/database");
const cors = require("cors")({
  origin: true,
});
const app = express();
const PORT = process.env.PORT || 3000;

connection.connect().then((res) => {
  app.listen(PORT, function () {});
});

app.use(cors);
app.use(express.json());
app.use(express.urlencoded());

app.use("/user", userRoutes);
app.use("/video", videoRoutes);
app.use("/payment", paymentRoutes);
app.use("/contact", contactRoutes);
// Use Api routes in the App
app.get("/", (req, res) => {
  res.status(200).send("workismg");
});
