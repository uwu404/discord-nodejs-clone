const User = require("../../models/user")

function createUser(app) {
    app.post("/createuser", (req, res) => {
        const { email, password, username } = req.body
        if (!email || !password || !username) return res.send(`{"error": "cannot create account"}`)
        const user = new User({
            username: username,
            id: 0,
            avatarURL: "https://i.imgur.com/yl5M70Zl.png",
            tag: "0001",
            email: email,
            password: password,
            token: makeid(40),
            presence: {
                online: true
            }
        })

        user.save()
            .then(result => {
                res.send(result)
            })
            .catch(err => console.log(err))
    })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = createUser