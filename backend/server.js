import http from "http";
import express from "express";
import cors from "cors";
import { Server as socketIO } from "socket.io";
import dotenv from 'dotenv';
import connectDB from "./config/conn.js";
import Chat from './models/chatModel.js';
import User from './models/userModel.js';
dotenv.config();



connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

const users = {};

app.use(cors());

app.get("/", (req, res) => {
    res.send("HELLO, IT'S WORKING");
});

const server = http.createServer(app);

const io = new socketIO(server, {
    cors: {
        origin: ["http://localhost:8081", "http://localhost:19000", "http://localhost:19001"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("New Connection");
    console.log("User connected: ", socket.id);

    socket.on('joined', async ({ user }) => {
        console.log(user);
        users[socket.id] = user;
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined', { user: "Admin", message: ` ${users[socket.id]} has joined` });
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${users[socket.id]}` });

        // Save user to MongoDB
        await User.create({ socketId: socket.id, username: user });
    });

    socket.on('message', async ({ message, id }) => {
        console.log(message, id);
        io.emit('sendMessage', { user: users[id], message, id });

        // Save message to MongoDB
        await Chat.create({ user: users[id], message, id });
    });

    socket.on('disconnect', async () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` });
        console.log(`user left`);
        delete users[socket.id];

        // Remove user from MongoDB
        await User.findOneAndDelete({ socketId: socket.id });
    });
});

app.listen(PORT, () => {
    console.log(
      `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
        .white
    );
  });
  
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });