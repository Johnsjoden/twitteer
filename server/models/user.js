const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: {type: String, required: true, unqiue: true, minlength: 4},
    password: {type: String, required: true, minlength: 4},
    email: String,
    name: String,
    imageURL: String
})
const postSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content:{type: String, maxlength: 140, required: true },
    date: {type: Date, default: Date.now},
    id: {type: String}
})
userSchema.pre(
    "save",
    async function(next){
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash;
        next()
    }
)
userSchema.statics.login = async function(username, password){
        const user = await User.findOne({username})
        if(user && await bcrypt.compare(password, user.password)){
            return user
        }
        return null
    }
const User = mongoose.model("User", userSchema)
const Post = mongoose.model("Post", postSchema);
exports.Post = Post
exports.User = User