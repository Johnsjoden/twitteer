const express = require("express");
const mongoose = require("mongoose")
const {User, Post} = require("./models/user")
const JWT = require("jsonwebtoken")
const path = require("path")
const multer = require("multer")
const http = require("http")
const { Server } = require("socket.io")

const app = express();
const server = http.createServer(app)

const io = new Server((server), {
    cors: {
        origin: "http://localhost:3000"
    }
})
const connect = () => {
    mongoose.connect("mongodb://localhost:27017/backend1")
}
connect()

const JWT_SECRET = "osdmfhomhdfomsdfom3209325masdo"
const PORT = process.env.PORT || 3001;



let storage = multer.diskStorage({
    destination: "public",
    filename: function(req, file, cb){
            cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname + "/public")))

app.use(upload.single("uploaded-file"))
app.use(express.json()) 
app.use( async (req, res, next) => {
    req.post = await Post.find()
    // error när någon har en expired token lös skiten
    const authHeader = req.header("Authorization")
        if(authHeader){ 
        const token  = authHeader.split(" ")[1]
        JWT.verify(token, JWT_SECRET, function(err) {
            if(err){
                err = {
                    name: 'TokenExpiredError',
                    message: 'jwt expired'
                }
                res.status(401).json(err)
            }else {
                req.user = JWT.verify(token, JWT_SECRET)
            }
        })
    }
    next()
    
})
const requireLogin = (req, res, next) => {
    try{
      if(req.user) {
        next() 
    } else {
        res.sendStatus(401);
    }  
    }
    catch(err){
        console.error("Double sends res..")
    }
    
}
// få in req, res, next till ios. 
const requirelol = (req, res, next) => {
    console.log(req.user)
}
app.post("/user", async (req ,res ) => {
    const {username, password} = req.body
    const user = new User({username, password});
    await user.save();
    res.json({username})  
    
})
app.patch("/user", requireLogin, async (req,res) => { 
    const { email, name, username } = req.body 
    const userId = mongoose.Types.ObjectId(req.user.userId)
    const updateProfile = {
        email, name, username
    }
    if(req.file){
        const imageURL = "http://localhost:3001/" + req.file.filename
        updateProfile.imageURL = imageURL
        /* const result = await User.findOneAndUpdate({_id: userId}, {"name": name, "email": email, "imageURL": imageURL, "username": username})
        res.send("Sucess") */
    }
    const result = await User.findOneAndUpdate({_id: userId}, updateProfile)
    res.send("Sucess")   
    
    
}) 
 
app.post("/token", async (req, res ) => {
    const {username, password} = req.body
    const user = await User.login(username, password)
    
     if(user) { 
        const userId = user._id.toString();
        const token = JWT.sign(
            {userId, username: user.username},  
            JWT_SECRET, 
            {expiresIn: "24h", subject: userId}
        )

        res.json({token})
    }else {
        res.sendStatus(401)
    }  
})
/* app.post("/password", (req, res) => {
    const {oldPassword, newPassword, checkPassword} = req.body
    console.log(req.body)
    res.send("hello from password")
}) */
// ALLA POST 
app.get("/post", async (req, res) => {
    const newData = await Post.find({}).populate("userId", "imageURL username name").sort({date: -1})
    res.json(newData)
})
app.get("/post/:id", async (req, res ) => {
    try{
        const id = req.params.id
        const result = await Post.find({userId: id}).populate("userId", "imageURL username name").sort({date: -1})
        res.json(result)
    }catch(err){
        res.sendStatus(404)
    }
})

app.get("/profile/:id", async (req, res ) => {
    try{ 
        const id = req.params.id
        const result = await User.findOne({_id: id}, {imageURL: 1, username: 1, email: 1, name: 1})
        res.json(result) 
    }catch(err){
        err = {
            "message": "User not found"
        }
        res.status(404).json(err)
    }
    
})
app.get("/hashtag/:id",requireLogin, async (req, res) => {
    const hashtag = req.params.id 
    const result = await Post.find({'content': {'$regex': new RegExp(`#\\b${hashtag}\\b`, "gi")}}).populate("userId", "imageURL username name").sort({date: -1})
    res.json(result) 
}) 

app.post("/posts", requireLogin ,async (req, res ) => {
    const id = req.post 
    const data = {
        content: req.body.contentData,
        userId: req.user.userId,
        id: id.length
    } 
    const post = await new Post(data)
    post.save()
    res.send("Post got added")
})
// DELETE
app.delete("/delete/:id", requireLogin, async (req, res ) => {
    const id = req.params.id
    const deletePost = await Post.deleteOne({_id: id})
    res.json({message: "deleted post"})
})
app.get("/me", (req, res) => {
    const userId = req.user.userId
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});