const authenticateToken = require("../../globalFunctions/authenticateToken")
const User = require("../../models/user")
const express = require("express")
const router = express.Router()

router.delete("/notifications", authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id)
    const notifications = user.notifications.filter(n => n.id !== req.query.id)
    await User.findByIdAndUpdate(user._id, { notifications })
    res.status("200").send('{"message": "success"}')
})

module.exports = router