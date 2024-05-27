const User = require("../../models/user")
const Server = require("../../models/server")
const createMember = require("../../globalFunctions/createmember")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.patch("/customstatus", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(401).send({ error: "unauthorized" })
    user.customStatus = req.body.customStatus
    const newMember = await user.save()
    res.send({ message: "succesfully changed", customStatus: req.body.customStatus })
    const servers = await Server.find({ members: user._id })
    let rooms = io.to(user._id.toString())
    for (const server of servers) rooms = rooms.to(server._id.toString())
    for (const friend of user.friends) rooms = rooms.to(friend.toString())
    rooms.emit("memberUpdate", createMember(newMember))
})

module.exports = router