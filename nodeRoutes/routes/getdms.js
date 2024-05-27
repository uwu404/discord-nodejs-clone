const User = require("../../models/user")
const Dms = require("../../models/dms")
const mongoose = require("mongoose")
const express = require("express")
const createMember = require("../../globalFunctions/createmember")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.get("/dm/:user", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!mongoose.isValidObjectId(req.params.user)) return res.status(500).send("oops something went wrong")
    const reciever = await User.findById(req.params.user)
    if (!user || !reciever) return res.status(500).send("oops something went wrong")
    const dm = await Dms.findOne({ users: { $all: [user._id, reciever._id] } })
        .populate({
            path: "messages",
            populate: [{ path: "author" }, { path: "invite" }]
        }) || new Dms({
            users: [user._id, reciever._id],
            messages: []
        })
    const result = dm.messages.map(m => ({ ...m.toObject(), author: createMember(m.author) }))
    res.send(result)
})

module.exports = router