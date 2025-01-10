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
  if (!userFind) return console.log("User not found")
  bcrypt.compare(password, userFind.password, (error, result) => {
    if (!result) return console.log("Password is Wrong .");
    const token = jwt.sign({ email }, "shaaa");
    res.cookie("token", token);
    console.log("Login is done.")
    res.render("welcome", { userFind })
  })


})


function private(req, res, next) {
  if (req.cookies.token == "") res.send("Login first please!");
  else {
    const data = jwt.verify(req.cookies.token, "shaaa");
    console.log(data);
    req.user = data
    next()
  }

}

app.get("/profile", private, (req, res) => {
  res.send("This is profile Page .");
  console.log(req.user)

})







app.get("/logout", (req, res) => {
  res.cookie("token", "")
  console.log("Logout is done.")
  res.redirect("/")
})
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
})