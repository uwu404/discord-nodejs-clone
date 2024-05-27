const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: { type: String, default: "image" },
    data: Buffer,
    dynamic: Boolean
})

const Image = mongoose.model("image", imageSchema)

module.exports = Image