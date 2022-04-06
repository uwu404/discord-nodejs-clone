const User = require("../../models/user")
const crypto = require("crypto")

function createUser(app) {
    app.post("/createuser", async (req, res) => {
        const { email, password, username } = req.body
        if (!email || !password || !username) return res.send(`{"error": "missing password or email or username"}`)
        if (password.length > 25 || username.length > 25) return res.send(`{"error": "usernames and passwords can't be over 25 characters"}`)
        const salt = crypto.randomBytes(16).toString("hex")
        const hashedPassword = crypto.scryptSync(password, salt, 64).toString("hex")
        const token = crypto.randomBytes(60).toString("hex")
        const user = new User({
            username: username,
            avatarURL: "images/default",
            tag: `#${r()}${r()}${r()}${r()}`,
            email: email,
            password: `${salt}:${hashedPassword}`,
            token: token,
            presence: {
                online: true
            },
            notifications: [],
        })

        const result = await user.save()
            .catch(err => console.log(err))
        res.send(result)
    })
}

function r() {
    return Math.floor(Math.random() * 9)
}

module.exports = createUser