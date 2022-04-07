const User = require("../../models/user")
const Server = require("../../models/server")
const express = require("express")
const router = express.Router()
const { io } = require("../../")

router.patch("/leave/:server", async (req, res) => {
    const token = req.headers.authorization
    const user = await User.findOne({ token })
    const server = await Server.findById(req.params.server)
    if (!user || !server || server.owner == user._id) return res.status(500).send("error")
    if (!server.members.includes(user._id)) return res.status("500").send("error")
    const result = await Server.findByIdAndUpdate(server._id, {
        members: server.members.filter(m => !user._id.equals(m))
    })
    res.send(result)
    io.to(`${user._id}`).emit("leave", server)
})

module.exports = router