const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    server: { type: Schema.Types.ObjectId, ref: "server" },
    name: String,
    type: String
}, { timestamps: true });

const Channel = mongoose.model("channel", channelSchema);

module.exports = Channel