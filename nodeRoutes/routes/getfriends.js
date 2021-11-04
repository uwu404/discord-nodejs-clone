const User = require("../../models/user")

function getFriends(app) {
    app.get("/friends", async (req, res) => {
        const token = req.headers.authorization;
        const user = await User.findOne({ token })
        const friendsArray = await User.find({ _id: { $in: user.friends } })
        const friends = Array.from(friendsArray, f => {
            return {
                username: f.username,
                _id: f._id,
                avatarURL: f.avatarURL,
                tag: f.tag,
                online: f.online
            }
        })
        res.send(friends)
    })
}

module.exports = getFriends