const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    data: String,
    name: String
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image