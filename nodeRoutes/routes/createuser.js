const User = require("../../models/user")

function createUser(app) {
    app.post("/createuser", (req, res) => {
        const { email, password, username } = req.body
        if (!email || !password || !username) return res.send(`{"error": "missing password or email or username"}`)
        if (password.length > 25 || username.length > 25) return res.send(`{"error": "usernames and passwords can't be over 25 characters"}`)
        const user = new User({
            username: username,
            id: 0,
            avatarURL: "default.svg",
            tag: `#${r()}${r()}${r()}${r()}`,
            email: email,
            password: password,
            token: makeid(69), // nice ;)
            presence: {
                online: true
            }
        })

        user.save()
            .then(result => res.send(result))
            .catch(err => console.log(err))
    })
}

function makeid(length) {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

function r() {
    return Math.floor(Math.random() * 9)
}

module.exports = createUser