const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth/", userRoutes);
app.use("/api/messages/", messageRoutes);

const puerto = process.env.PORT;

mongoose
  .connect(
    "mongodb+srv://miguelvalera97:oCywjm6F8gLIw9lo@groovechat.2nwtwiv.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connection succesfull");
  })
  .catch((error) => {
    console.log(error.message);
  });

const server = app.listen(5000, () => {
  console.log(`server started on port: ${puerto}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
