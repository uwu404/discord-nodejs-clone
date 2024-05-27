const Server = require("../models/server")
const User = require("../models/user")
const join = require("./events/join")
const signaling = require("./events/signaling")

const collect = (io, servers, friends, socket) => {
    let rooms = io
    for (const friend of friends) rooms = rooms.to(friend.toString())
    for (const server of servers) { 
        socket.join(server._id.toString())
        rooms = rooms.to(server._id.toString())
    }
    return rooms
}

const socketEvents = (io) => {
    io.on("connection", async socket => {
        console.log("new user connected: " + socket.ultraId)
        join(socket)
        signaling(socket, io)
        const user = await User.findById(socket.ultraId)
        const servers = await Server.find({ members: user._id })
        const rooms = collect(io.to(user._id.toString()), servers, user.friends, socket)
        rooms.emit("statusChange", { user: user._id, status: user.status })
        socket.once("disconnect", () => {
            if (io.sockets.adapter.rooms.get(user._id.toString())?.size) return
            rooms.emit("statusChange", { user: user._id, status: "offline" })
        })
    })
}

module.exports = socketEvents