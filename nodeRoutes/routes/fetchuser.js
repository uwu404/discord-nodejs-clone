const User = require("../../models/user")

function fetchUser(app) {
    app.get("/fetch/:user", async (req, res) => {
        const user = await User.findById(req.params.user)
        if (!user) return res.status(500).send("error")
        const data = {
            username: user.username,
            tag: user.tag,
            avatarURL: user.avatarURL
        }
        res.send(data)
    })
}

module.exports = fetchUser