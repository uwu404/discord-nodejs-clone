const User = require("../../models/user")
const crypto = require("crypto")

function createUser(app) {
    app.post("/createuser", (req, res) => {
        const { email, password, username } = req.body
        if (!email || !password || !username) return res.send(`{"error": "missing password or email or username"}`)
        if (password.length > 25 || username.length > 25) return res.send(`{"error": "usernames and passwords can't be over 25 characters"}`)
        const user = new User({
            username: username,
            avatarURL: "default.svg",
            tag: `#${r()}${r()}${r()}${r()}`,
            email: email,
            password: password,
            token: crypto.randomBytes(69).toString("hex"),
            presence: {
                online: true
            }
        })

        user.save()
            .then(result => res.send(result))
            .catch(err => console.log(err))
    })
}

function r() {
    return Math.floor(Math.random() * 9)
}

module.exports = createUser