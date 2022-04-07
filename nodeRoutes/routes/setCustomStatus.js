const User = require("../../models/user")
const Server = require("../../models/server")
const createMember = require("../../globalFunctions/createMember")
const express = require("express")
const router = express.Router()
const { io } = require("../../")

router.patch("/customstatus", async (req, res) => {
    const user = await User.findOne({ token: req.headers.authorization })
    if (!user) return res.status(401).send({ error: "unauthorized" })
    user.customStatus = req.body.customStatus
    const newMember = await user.save()
    res.send({ message: "succesfully changed" })
    const servers = await Server.find({ members: user._id })
    let rooms = io
    for (const server of servers) rooms = rooms.to(`${server._id}`)
    for (const friend of user.friends) rooms = rooms.to(friend)
    rooms.emit("memberUpdate", createMember(newMember))
})

module.exports = router