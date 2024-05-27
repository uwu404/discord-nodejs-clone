const User = require("../../models/user")
const Dm = require("../../models/dms")
const createMember = require("../../globalFunctions/createmember")
const express = require("express")
const authenticateToken = require("../../globalFunctions/authenticateToken")
const router = express.Router()

router.get("/dms/logs", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const dms = await Dm.find({ users: user._id })
        .populate("users")
    const logs = dms.sort((a, b) => {
        const timestampA = new Date(a.updatedAt)
        const timestampB = new Date(b.updatedAt)
        return timestampB.getTime() - timestampA.getTime()
    })
        .map(dm => [createMember(dm.users[0]), createMember(dm.users[1])])
        .flat(1)
        .filter(u => !user._id.equals(u._id))
    res.send(logs)
})

module.exports = router