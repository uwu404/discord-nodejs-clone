const isOnline = require("./isOnline")

// removes private credentials from a user
const createMember = (user) => {
    return { ...user.toObject(), password: null, email: null, friends: null, status: isOnline(user._id.toString()) ? user.status : "offline" }
}

module.exports = createMember