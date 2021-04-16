const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serverSchema = new Schema({
    owner: String,
    icon: String,
    name: String,
    members: [String],
    invites: [String]
}, { timestamps: true });

const Server = mongoose.model("server", serverSchema);

module.exports = Server