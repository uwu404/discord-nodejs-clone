const User = require("../../models/user")
const Server = require("../../models/server")
const createImage = require("../../globalFunctions/createimage")
const createMember = require("../../globalFunctions/createmember")
const express = require("express")
const router = express.Router()
const { io } = require("../../")
const errors = require("../../globalFunctions/errors")
const authenticateToken = require("../../globalFunctions/authenticateToken")

router.patch("/user/edit", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)

    // checks
    const { invalidArgs } = errors
    if (req.body.profileColor && !/^#[0-9A-F]{6}$/i.test(req.body.profileColor)) return invalidArgs.send(res)
    if (req.body.about && typeof req.body.about !== "string") return invalidArgs.send(res)
    if (req.body.username && typeof req.body.username !== "string") return invalidArgs.send(res)

    // create the user's avatar
    const base64str = req.body.data?.split(",")[1]
    const av = await createImage(base64str, { width: 512, height: 512, quality: 90 })

    // save
    User.findByIdAndUpdate(user._id, {
        username: req.body.username || user.username,
        ...(!!av && { avatarURL: av.URL }),
        profileColor: req.body.profileColor?.substring(0, 10) || user.profileColor,
        about: req.body.about?.substring(0, 100) ?? user.about
    }, { new: true })
        .then(async user => {
            res.send({ ...user.toObject() })
            const servers = await Server.find({ members: user._id })
            let rooms = io.to(user._id.toString())
            for (const server of servers) rooms = rooms.to(server._id.toString())
            for (const friend of user.friends) rooms = rooms.to(friend)
            rooms.emit("memberUpdate", createMember(user))
        })
})

module.exports = router