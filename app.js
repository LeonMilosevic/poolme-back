const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { ioConnect } = require("./controllers/ride");

io.on("connection", ioConnect);
// middleware
app.use(cors());
app.use(bodyParser.json());

// database
connectDB();

// routes
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const rideRouter = require("./routes/ride");

// routes middleware
app.use("/api", authRouter);
app.use("/api", postsRouter);
app.use("/api", userRouter);
app.use("/api", rideRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
