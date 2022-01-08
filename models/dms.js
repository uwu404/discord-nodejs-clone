const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dmSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "message" }]
}, { timestamps: true });

const Dm = mongoose.model("dm", dmSchema);

module.exports = Dm