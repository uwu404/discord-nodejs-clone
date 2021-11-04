const User = require("../../models/user")

function acceptFriendRequest(app) {
    app.post("/accept/:user", async (req, res) => {
        const token = req.headers.authorization;
        const user = await User.findOne({ token })
        const sender = await User.findOne({ _id: req.params.user })
        console.log(sender, user)
        if (!user || !sender) return res.status(403).send("error")
        if (!user.friendRequests.some(r => r.recieved && r.user === `${sender._id}`)) return res.status(403).send("error")
        user.friendRequests.splice(user.friendRequests.indexOf(user.friendRequests.find(i => i.user === sender._id)))
        sender.friendRequests.splice(sender.friendRequests.indexOf(sender.friendRequests.find(i => i.user === user._id)))
        user.friends.push(`${sender._id}`)
        sender.friends.push(`${user._id}`)
        await sender.save()
        const result = await user.save()
        res.send(result)
    })
}

module.exports = acceptFriendRequest