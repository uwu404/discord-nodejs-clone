const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "user" },
    content: String,
    channel: String, 
    edited: Number,
    timestamp: Number,
    attachment: {
        width: Number,
        height: Number,
        URL: String
    },
    invite: { type: Schema.Types.ObjectId, ref: "server" }
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema);

module.exports = Message