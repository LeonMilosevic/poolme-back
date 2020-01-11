const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  const { Post } = require("./models/post");
  const postId = socket.handshake.headers.referer.slice(33);
  // handle output, send chat messages to client
  socket.on("output", function(fn) {
    Post.findById(postId, (error, result) => {
      if (error) return console.log(error);

      fn(result);
    });
  });

  sendStatus = function(s) {
    socket.emit("status", s);
  };

  socket.on("input", function(data) {
    let name = data.name;
    let message = data.message;

    if (name === "" || message === "") {
      return sendStatus("please enter a message");
    }
    let chat = { name, message };
    Post.findByIdAndUpdate(
      postId,
      { $push: { "ride.chat": chat } },
      (error, result) => {
        if (error) return sendStatus("there was an error sending your message");

        io.emit("message", chat);
      }
    );
  });
});

// middleware
app.use(cors());
app.use(bodyParser.json());

// database
connectDB();

// routes
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");

// routes middleware
app.use("/api", authRouter);
app.use("/api", postsRouter);
app.use("/api", userRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
