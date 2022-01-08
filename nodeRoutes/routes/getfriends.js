const User = require("../../models/user");
const createMember = require("../../globalFunctions.js/createMember");

function getFriends(app) {
    app.get("/friends", async (req, res) => {
        const token = req.headers.authorization;
        const user = await User.findOne({ token }).populate("friends")
        const friends = Array.from(user.friends, f => createMember(f))
        res.send(friends)
    })
}

module.exports = getFriends