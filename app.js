const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// database
connectDB();

// routes
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");

// routes middleware
app.use("/api", authRouter);
app.use("/api", postsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
