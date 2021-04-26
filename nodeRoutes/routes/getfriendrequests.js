const User = require("../../models/user")

function getFriendRequests(app) {
    app.get("/friends/pending", async (req, res) => {
        const token = req.headers.authorization;
        const user = await User.findOne({ token })
        const requestsArray = Array.from(user.friendRequests, r => r.user)
        const users = await User.find({ _id: { $in: { requestsArray } } })
        const userMap = users.map(u => {
            return {
                username: u.username,
                avatarURL: u.avatarURL,
                _id: user._id,
                tag: user.tag
            }
        })
        res.send(userMap)
    })
}

module.exports = getFriendRequests