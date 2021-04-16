const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    avatarURL: String,
    tag: String,
    email: String,
    password: String,
    token: String,
    presence: {
        online: Boolean
    },
    friendRequests: [],
    friends: []
});

const User = mongoose.model("user", userSchema);

module.exports = User