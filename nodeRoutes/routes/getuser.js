const User = require("../../models/user")
const Server = require("../../models/server")
const createMember = require("../../globalFunctions/createmember")
const Dm = require("../../models/dms")
const express = require("express")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.get("/user", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const servers = await Server.find({ members: user._id }).populate("channels")
    const notifications = Array.from(user.notifications, (notification) => notification.type === "dm" && notification.id)
    const users = await User.find({ _id: { $in: notifications } })
    const mappedusers = users.map(u => ({
        user: createMember(u),
        type: "dm",
        id: u._id
    }))
    
    const dms = await Dm.find({ users: user._id })
        .populate("users")
    const logs = dms.sort((a, b) => {
        const timestampA = new Date(a.updatedAt)
        const timestampB = new Date(b.updatedAt)
        return timestampB.getTime() - timestampA.getTime()
    })
        .map(dm => [createMember(dm.users[0]), createMember(dm.users[1])]).flat(1)
        .filter(u => !user._id.equals(u._id))
    res.send({
        ...user.toObject(),
        servers,
        notifications: notifications.map(n => mappedusers.find(u => u.id == n)),
        logs
    })
})

module.exports = router