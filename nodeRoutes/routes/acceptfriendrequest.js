const User = require("../../models/user")

function acceptFriendRequest(app) {
    app.post("/accept/:user", async (req, res) => {
        const token = req.headers.authorization;
        const user = await User.findOne({ token })
        const sender = await User.findOne({ _id: req.params.user })
        if (!user || !sender) return res.status = 404
        if (!user.friendRequests.some(r => r.recieved && r.user === `${sender._id}`)) return res.status = 404
        user.friends.push(`${sender._id}`)
        sender.friends.push(`${user._id}`)
        await sender.save()
        const result = await user.save()
        res.send(result)
    })
}

module.exports = acceptFriendRequest