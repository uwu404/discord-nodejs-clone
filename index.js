const mongoose = require("mongoose");
const express = require("express");
const http = require("http")
const cors = require("cors")
const websocketEvents = require("./websocketEvents")
const app = express()
const socketio = require("socket.io")
const dburi = process.env.URI
const routes = require("./nodeRoutes");

const server = http.createServer(app)

const PORT = process.env.PORT || 80

const io = socketio(server)

app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(cors())

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
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