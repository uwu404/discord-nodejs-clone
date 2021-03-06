const User = require("../../models/user")
const Server = require("../../models/server")
const express = require("express")
const router = express.Router()

router.post("/servers/:server", async (req, res) => {
    const token = req.headers.authorization
    const user = await User.findOne({ token })
    const server = await Server.findOne({ invites: req.params.server }).populate("channels")
    if (!user || !server) return res.status(500).send("error")
    if (!server.members.includes(user._id)) server.members.push(user._id)
    const result = await server.save()
    res.send(result)
})

module.exports = router