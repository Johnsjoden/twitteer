const mongoose = require("mongoose")
const {User} = require("./user")
const postSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content:{type: String, maxlength: 140, required: true },
    date: {type: Date, default: Date.now},
    id: {type: String}
})

const Post = mongoose.model("Post", postSchema);

exports.Post = Post  