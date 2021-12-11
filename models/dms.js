const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dmSchema = new Schema({
    users: [String],
    messages: [String]
}, { timestamps: true });

const Dm = mongoose.model("dm", dmSchema);

module.exports = Dm