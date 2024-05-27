const User = require("../../models/user");
const createMember = require("../../globalFunctions/createmember");
const express = require("express");
const authenticateToken = require("../../globalFunctions/authenticateToken");
const router = express.Router()

router.get("/friends/pending", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("friendRequests.user")
    if (!user) return res.status(403)
    const userMap = user.friendRequests.map(request => ({ ...createMember(request.user), received: request.received }))
    res.send(userMap)
})

module.exports = router