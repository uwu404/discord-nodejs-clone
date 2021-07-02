const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    data: Buffer,
    name: String,
    dynamic: Boolean
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image