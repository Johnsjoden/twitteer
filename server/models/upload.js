const mongoose = require("mongoose")

const uploadSchema = mongoose.Schema({
    image: {type: Buffer}
})

const Upload = mongoose.model("Upload", uploadSchema)

exports.Upload = Upload