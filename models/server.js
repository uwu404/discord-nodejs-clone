const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serverSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    icon: String,
    name: String,
    members: [{ type: Schema.Types.ObjectId, ref: "user" }],
    invites: [String],
    channels: [{ type: Schema.Types.ObjectId, ref: "channel" }]
}, { timestamps: true });

const Server = mongoose.model("server", serverSchema);

module.exports = Server