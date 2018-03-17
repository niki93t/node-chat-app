const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require("./utils/message");

var publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.emit("newMessage", generateMessage("Admin", "Welcome"));

    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));

    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message);

        io.emit("newMessage", generateMessage(message.from, message.text));

        callback();
    });

    socket.on("createLocationMessage", (message) => {
        console.log("createLocationMessage", message);

        io.emit("newLocationMessage", generateLocationMessage(message.from, message.latitude, message.longitude));
    });

    socket.on("disconnect", (socket) => {
        console.log("User was disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});