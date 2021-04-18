const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: String,
    content: String,
    channel: String, 
    timestamp: Number,
    attachment: {
        width: Number,
        height: Number,
        URL: String
    }
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema);

module.exports = Message