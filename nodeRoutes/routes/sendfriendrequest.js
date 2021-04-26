const User = require("../../models/user")

function sendFriendRequest(app) {
    app.post("/users/:user/request", async (req, res) => {
        const token = req.headers.authorization
        const user = await User.findOne({ token })
        const pending = await User.findOne({ _id: req.params.user })
        if (!user || !pending) return res.status = 404
        if (user.friendRequests.some(r => r.user === `${pending._id}`)) return res.status = 404
        user.friendRequests.push({ recieved: false, user: `${pending._id}` })
        pending.friendRequests.push({ recieved: true, user: `${user._id}` })
        await pending.save()
        const result = await user.save()
        res.send(result)
    })
}

module.exports = sendFriendRequest