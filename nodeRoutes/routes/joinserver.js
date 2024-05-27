const User = require("../../models/user")
const Server = require("../../models/server")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const createMember = require("../../globalFunctions/createmember")
const serverConnections = require("../../globalFunctions/serverconnections")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.post("/servers/:server", authenticateToken, async (req, res) => {
    const token = req.headers.authorization
    const user = await User.findById(req.user._id)
    const server = await Server.findOne({ invites: req.params.server })
        .populate("channels")
        .populate("members")
    if (!user || !server) return res.status(500).send("error")
    if (server.members.some(m => m._id.equals(user._id))) return
    server.members.push(user._id)
    const channels = await serverConnections(server)
    const result = await server.save()
    res.send({ ...result.toObject(), channels })
    // notify every instance of this user
    io.to(user._id.toString()).emit("serverJoin", { ...result.toObject(), channels })
    // notify the server
    io.to(server._id.toString()).emit("memberJoin", { ...result.toObject(), channels }, createMember(user))
    // join the server's socketio room
    const userSockets = Array.from(io.sockets.sockets)
        .filter(socket => socket[1].ultraId === user._id.toString())
        .map(socket => socket[1])
    userSockets.forEach(socket => socket.join(server._id.toString()))
})

module.exports = router