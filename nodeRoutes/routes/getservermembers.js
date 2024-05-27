const User = require("../../models/user")
const Server = require("../../models/server")
const mongoose = require("mongoose")
const createMember = require("../../globalFunctions/createmember")
const express = require("express")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.get("/servers/:server/members", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!mongoose.isValidObjectId(req.params.server)) return res.status(403)
    const server = await Server.findOne({ _id: req.params.server }).populate("members")
    if (!server || !user || !server.members.some(u => user._id.equals(u._id))) return res.status(500).send("something went wrong")
    const members = server.members.map(u => createMember(u))
    res.send(members)
})

module.exports = router