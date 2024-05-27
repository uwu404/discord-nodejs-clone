const User = require("../../models/user")
const Server = require("../../models/server")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const createMember = require("../../globalFunctions/createmember")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.patch("/leave/:server", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const server = await Server.findById(req.params.server)
    if (!server || server.owner == user._id) return res.status(500).send("error")
    if (!server.members.some(m => user._id.equals(m))) return res.status("500").send("error")
    const result = await Server.findByIdAndUpdate(server._id, {
        members: server.members.filter(m => !user._id.equals(m))
    })
    res.send(result)
    io.to(user._id.toString()).emit("leave", server.toObject())
    io.to(server._id.toString()).emit("memberLeave", server.toObject(), createMember(user))
    const userSockets = Array.from(io.sockets.sockets)
        .filter(socket => socket[1].ultraId === user._id.toString())
        .map(socket => socket[1])
    userSockets.forEach(socket => socket.leave(server._id.toString()))
})

module.exports = router