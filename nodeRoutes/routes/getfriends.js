const User = require("../../models/user");
const createMember = require("../../globalFunctions/createmember")
const express = require("express");
const authenticateToken = require("../../globalFunctions/authenticateToken");
const router = express.Router()

router.get("/friends", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id).populate("friends")
    const friends = Array.from(user.friends, f => createMember(f))
    res.send(friends)
})

module.exports = router