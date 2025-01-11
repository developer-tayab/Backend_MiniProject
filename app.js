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
      console.log(userCreate, "User created successfully");
      res.redirect("/login")
    })
  })
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  const userFind = await userSchema.findOne({ email })
  if (!userFind) return res.redirect("/login")
  bcrypt.compare(password, userFind.password, (error, result) => {
    if (!result) return res.redirect("/login")
    const token = jwt.sign({ email }, "shaaa");
    res.status(200)
    res.cookie("token", token);
    res.redirect("/profile")
    console.log("Login is done.")
  })


})


function private(req, res, next) {
  if (req.cookies.token == "") res.redirect("/login");
  else {
    const data = jwt.verify(req.cookies.token, "shaaa");
    console.log(data);
    req.user = data
    next()
  }

}

app.get("/profile", private, async (req, res) => {
  const { email } = req.user
  const userFind = await userSchema.findOne({ email })
  console.log(userFind)
  res.render("profile", { userFind })


})






app.get("/logout", (req, res) => {
  res.cookie("token", "")
  console.log("Logout is done.")
  res.redirect("/")
})
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
})