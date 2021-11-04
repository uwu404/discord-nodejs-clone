const User = require("../../models/user")

function getFriendRequests(app) {
    app.get("/friends/pending", async (req, res) => {
        const token = req.headers.authorization;
        const user = await User.findOne({ token })
        if (!user) return res.status(404)
        const requestsArray = Array.from(user.friendRequests, r => r.user)
        const users = await User.find({ _id: { $in: requestsArray } })
        const userMap = []
        for (let i = 0; i < users.length; i++) {
            userMap.push({ 
                username: users[i].username,
                avatarURL: users[i].avatarURL,
                _id: users[i]._id,
                tag: users[i].tag,
                recieved: user.friendRequests[i].recieved
            })
        }
        res.send(userMap)
    })
}

module.exports = getFriendRequests