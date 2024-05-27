const mongoose = require("mongoose");
const express = require("express");
const http = require("http")
const cors = require("cors")
const websocketEvents = require("./websocketEvents")
const app = express()
const socketio = require("socket.io")
const routes = require("./nodeRoutes")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const server = http.createServer(app)

const PORT = process.env.PORT || 80
const { ACCESS_TOKEN_SECRET, DBURI } = process.env

const io = new socketio.Server(server)

app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: false }));
app.use(cors())

io.use((socket, next) => {
    if (!socket.handshake.auth.token) return next(new Error("thou shall not pass"))
    jwt.verify(socket.handshake.auth.token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return next(new Error("server error"))
        socket.join(user._id)
        socket.ultraId = user._id
        next()
    })
})


mongoose.connect(DBURI)
    .then(() => {
        console.log("connected to db")
        routes(app)
        websocketEvents(io)
    })
    .catch(err => console.log(err))

server.listen(PORT, () => {
    console.log(`live on ${PORT}`)
})

module.exports = { io }