const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const userSchema = require("./models/user.models")
const postSchema = require("./models/post.models")
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")



app.get("/", (req, res) => {
  res.render("home")

})

app.post("/create", async (req, res) => {
  const { username, name, email, password, age } = req.body
  const userFind = await userSchema.findOne({ email })
  if (userFind) return res.send("User already exists");
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, async (error, hash) => {
      const userCreate = await userSchema.create({ username, name, email, password: hash, age });
      const token = jwt.sign({ email }, "shaaa");
      res.cookie("token", token);
      console.log(userCreate);
      res.send("User created successfully");
    })
  })
})


app.get("/post" , async (req , res)=>{
 await postSchema.create({content : "This is a post"})
 res.send("Post created successfully")
})











app.get("/logout", (req, res) => {
  res.clearCookie()
  console.log("Logout is done.")
  res.redirect("/")
})
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
})