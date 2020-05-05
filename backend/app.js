const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();
//big funnel, which has different partsA

mongoose.connect("mongodb+srv://emily:MuWMRGeBswc7sq0P@cluster0-j8jr9.azure.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  //identifier, any domain
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, PUT, PATCH, GET, DELETE, OPTIONS'
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
