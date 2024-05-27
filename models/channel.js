const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    server: { $type: Schema.Types.ObjectId, ref: "server" },
    name: String,
    type: {
        $type: String,
        default: "text",
        enum: ["text", "voice", "category"]
    }
}, { timestamps: true, typeKey: "$type" })

const Channel = mongoose.model("channel", channelSchema);

module.exports = Channel