const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    avatarURL: String,
    tag: String,
    email: String,
    password: String,
    online: Boolean,
    status: { 
        $type: String, 
        default: "online", 
        enum: ["online", "dnd", "idle", "offline"] 
    },
    customStatus: String,
    friendRequests: [
        { 
            received: Boolean, 
            user: { $type: Schema.Types.ObjectId, ref: "user" } 
        }
    ],
    friends: [{ $type: Schema.Types.ObjectId, ref: "user" }],
    notifications: [
        {
            type: String,
            id: String
        }
    ],
    profileColor: String,
    lastCreatedServer: Date,
    about: String,
    muted: Boolean
}, { typeKey: "$type", timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User