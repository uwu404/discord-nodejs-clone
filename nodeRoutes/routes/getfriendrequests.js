const User = require("../../models/user");
const createMember = require("../../globalFunctions/createMember");
const express = require("express")
const router = express.Router()

router.get("/friends/pending", async (req, res) => {
    const token = req.headers.authorization;
    const user = await User.findOne({ token })
        .populate("friendRequests.user")
    if (!user) return res.status(403)
    const userMap = user.friendRequests.map(request => createMember(request.user, { received: request.received }))
    res.send(userMap)
})

module.exports = router