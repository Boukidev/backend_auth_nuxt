const express = require("express");
const mongoose = require("mongoose");
const authRouter = reuqire("./routes/routes");

// connect to db
const MONGOOSE_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.4r3gv.mongodb.net/${process.env.MONGO_DB}`;
mongoose
  .connect(MONGOOSE_URI)
  .then((res) => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.error(err));

// create express app
const app = express();
app.use(express.json());
// set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth/", authRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
