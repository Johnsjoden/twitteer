const express = require("express");
const mongoose = require("mongoose")
const {User, Post} = require("./models/user")
const JWT = require("jsonwebtoken")
const path = require("path")
const multer = require("multer")

const connect = () => {
    mongoose.connect("mongodb://localhost:27017/backend1")
}
connect()

const JWT_SECRET = "osdmfhomhdfomsdfom3209325masdo"
const PORT = process.env.PORT || 3001;
const app = express();

let storage = multer.diskStorage({
    destination: "public",
    filename: function(req, file, cb){
            cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, "/public")))
app.use(upload.single("uploaded-file"))
app.use(express.json())
app.use( async (req, res, next) => {
    req.post = await Post.find()
    // error när någon har en expired token lös skiten
    const authHeader = req.header("Authorization")
    if(authHeader){
        const token  = authHeader.split(" ")[1]
        req.user = JWT.verify(token, JWT_SECRET)
    }
    next()
})

const requireLogin = (req, res, next) => {
    if(req.user) {
        next()
    } else {
        res.sendStatus(401);
    }
}

app.post("/user", async (req ,res ) => {
    const {username, password} = req.body
    const user = new User({username, password});
    await user.save();
    res.json({username})  
    
})
app.patch("/user", requireLogin, async (req,res) => {
    const { email, name } = req.body
    if(req.file){
        const imageURL = req.file.filename
        const result = await User.findOneAndUpdate(req.user._id, {"email":  email, "name": name, "imageURL": imageURL})
    }
    const result = await User.findOneAndUpdate(req.user._id, {"email":  email, "name": name})
    res.json({message: "hello from user patch"})
})

app.post("/token", async (req, res ) => {
    const {username, password} = req.body
    const user = await User.login(username, password)
    
     if(user) {
        const userId = user._id.toString();
        const token = JWT.sign(
            {userId, username: user.username},
            JWT_SECRET, 
            {expiresIn: "1h", subject: userId}
        )
        res.json({token})
    }else {
        res.sendStatus(401)
    }  
})
// ALLA POST 
app.get("/post", async (req, res) => {
    const getPostData = await Post.find({collectionName: "post"}).sort({date: -1})
    const newData = await Post.find({}).populate("userId", "imageURL username name").sort({date: -1})
    const Data = await Post.aggregate([
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'userId', 
            'foreignField': '_id', 
            'as': 'userImage'
          }
        }, {
          '$project': {
            'content': 1, 
            'date': 1, 
            'userImage': {
              'image': 1, 
              'username': 1
            }
          }
        }
      ]).sort({date: -1})
    res.json(newData)
})

app.get("/profile/:name", async (req, res ) => {
    const name = req.params.name
    const result = await User.findOne({username: name}, {imageURL: 1, username: 1, email: 1})
    res.json(result)
})

app.post("/posts", requireLogin ,async (req, res ) => {
    console.log(req.user)
    const id = req.post
    console.log(id)
    const data = {
        content: req.body.contentData,
        userId: req.user.userId,
        id: id.length
    } 
    const post = await new Post(data)
    post.save()
    // vi använder utav req.user för att koppla vilken user som är i. Sedan findOne({}) där ligger allt
    // vi lägger in bilden + user._id för att koppla ihop posten.
    res.send("Post got added")
})
// DELETE
app.delete("/delete/:id", async (req, res ) => {
    const id = req.params.id
    const deletePost = await Post.deleteOne({_id: id})
    res.json({message: "deleted post"})
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});