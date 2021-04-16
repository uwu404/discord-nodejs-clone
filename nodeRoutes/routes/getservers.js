const User = require("../../models/user")
const Server = require("../../models/server")

function getservers(app) {
    app.get("/@me/servers", async (req, res) => {
        try {
            const token = req.headers.authorization;
            const user = await User.findOne({ token: token }).catch(err => console.log(err))
            const servers = await Server.find({ members: user._id }).catch(err => console.log(err))
            res.send(servers)
        } catch (err) {
            console.log(err)
            res.send('[]')
        }
    })
}

module.exports = getservers;