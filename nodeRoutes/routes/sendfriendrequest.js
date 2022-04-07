const User = require("../../models/user")
const express = require("express")
const router = express.Router()

    router.post("/users/:username&:tag/request", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const pending = await User.findOne({ username: req.params.username, tag: "#" + req.params.tag })
        if (!user) return res.status(401).send({ error: "Invalid token" })
        if (!pending) return res.status(401).send({ error: "Cannot find this user" })
        if (user._id.equals(pending._id)) return res.status(403).send({ error: "You can't send a friend request to yourself" })
        if (user.friendRequests.some(r => pending._id.equals(r.user))) return res.status(403).send({ error: "You have already sent a friend request to this user" })
        if (user.friends.includes(pending._id)) return res.status(403).send({ error: "You can't send a friend request to a friend" })
        user.friendRequests.push({ received: false, user: pending._id })
        pending.friendRequests.push({ received: true, user: user._id })
        await pending.save()
        const result = await user.save()
        res.send(result)
    })

module.exports = router