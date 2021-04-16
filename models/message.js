const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: String,
    content: String,
    channel: String, 
    timestamp: Number
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema);

module.exports = Message