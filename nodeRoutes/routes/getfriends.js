const User = require("../../models/user");
const createMember = require("../../globalFunctions/createMember")
const express = require("express")
const router = express.Router()

router.get("/friends", async (req, res) => {
    const token = req.headers.authorization;
    const user = await User.findOne({ token }).populate("friends")
    const friends = Array.from(user.friends, f => createMember(f))
    res.send(friends)
})

module.exports = router