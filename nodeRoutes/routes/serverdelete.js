const Server = require("../../models/server")
const Channel = require("../../models/channel")
const User = require("../../models/user")
const Message = require("../../models/message")
const express = require("express")
const router = express.Router()

router.delete("/servers/:server", async (req, res) => {
    const token = req.headers.authorization
    const user = await User.findOne({ token })
    const server = await Server.findOne({ _id: req.params.server, owner: user._id })
    if (!user || !server) return res.status(500).send("oops something went wrong 😂👌!1!1!!")
    if (`${server.owner}` !== `${user._id}`) return res.status(403).send("// 403 forbidden ")
    const channels = await Channel.find({ server: server._id })
    const channelArray = Array.from(channels, c => c._id)
    await Message.deleteMany({ channel: { $in: channelArray } })
    await Channel.deleteMany({ _id: { $in: channelArray } })
    const result = await server.delete()
    res.send(result)
})

module.exports = router