const User = require("../../models/user")
const mongoose = require("mongoose")
const express = require("express")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.post("/accept/:user", authenticateToken, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.user)) return res.sendStatus(404)
    const user = await User.findById(req.user._id)
    const sender = await User.findById(req.params.user)
    if(!user) return res.sendStatus(404)
    if (!sender) return res.sendStatus(404)
    if (!user.friendRequests.some(r => r.received && sender._id.equals(r.user))) return res.sendStatus(404)
    user.friendRequests.splice(user.friendRequests.indexOf(user.friendRequests.find(i => sender._id.equals(i.user))))
    sender.friendRequests.splice(sender.friendRequests.indexOf(sender.friendRequests.find(i => user._id.equals(i.user))))
    user.friends.push(sender._id)
    sender.friends.push(user._id)
    await sender.save()
    const result = await user.save()
    res.send(result)
})

module.exports = router