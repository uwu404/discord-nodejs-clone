const User = require("../../models/user")

function getuser(app) {
    app.get("/user/password=:password&email=:email", (req, res) => {
        User.findOne({ password: req.params.password, email: req.params.email })
            .then(result => {
                res.send(result)
            })
            .catch(console.log)
    })
}

module.exports = getuser;