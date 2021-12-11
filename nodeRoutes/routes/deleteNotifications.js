const User = require("../../models/user")

function deleteNotifications(app) {
    app.delete("/notifications", async (req, res) => {
        const user = await User.findOne({ token: req.headers.authorization })
        const notifications = user.notifications.filter(n => n.id !== req.query.id)
        await User.findByIdAndUpdate(user._id, { notifications })
        res.status("200").send('{"message": "success"}')
    })
}

module.exports = deleteNotifications