// Importing required modules
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const userSchema = require("./models/user.models");
const postSchema = require("./models/post.models");
const jwt = require("jsonwebtoken");
const uploads = require("./utils/multer");

// Middleware setup
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser()); // Parses cookies
app.use(express.static(path.join(__dirname, "public"))); // Serves static files
app.set("view engine", "ejs"); // Sets EJS as the template engine

// Routes and Controllers

// Home route
app.get("/", (req, res) => {
  res.render("home"); // Renders home page
});

// Profile upload page (protected)
app.get("/profileUpload", private, (req, res) => {
  res.render("profileUpload");
});

// Handle profile image upload
app.post("/upload", private, uploads.single("image"), async (req, res) => {
  const email = req.user.email;
  const userFind = await userSchema.findOne({ email });
  userFind.profilePic = req.file.filename;
  await userFind.save();
  res.redirect("/profile");
});

// Create a new user (sign-up)
app.post("/create", async (req, res) => {
  const { username, name, email, password, age } = req.body;
  const userFind = await userSchema.findOne({ email });
  if (userFind) return res.send("User already exists");

  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, async (error, hash) => {
      const userCreate = await userSchema.create({ username, name, email, password: hash, age });
      const token = jwt.sign({ email }, "shaaa");
      res.cookie("token", token);
      res.redirect("/login");
    });
  });
});

// Login page route
app.get("/login", (req, res) => {
  res.render("login");
});

// User login authentication
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userFind = await userSchema.findOne({ email });
  if (!userFind) return res.redirect("/login");

  bcrypt.compare(password, userFind.password, (error, result) => {
    if (!result) return res.redirect("/login");
    const token = jwt.sign({ email }, "shaaa");
    res.cookie("token", token);
    res.redirect("/profile");
  });
});

// Create a new post (authenticated)
app.post("/createPost", private, async (req, res) => {
  const { content } = req.body;
  const { email } = req.user;
  const FindUser = await userSchema.findOne({ email });
  const postCreate = await postSchema.create({ user: FindUser._id, content });
  FindUser.posts.push(postCreate._id);
  await FindUser.save();
  res.redirect("/profile");
});

// Middleware for protected routes
function private(req, res, next) {
  if (req.cookies.token == "") res.redirect("/login");
  else {
    const data = jwt.verify(req.cookies.token, "shaaa");
    req.user = data;
    next();
  }
}

// Profile route (authenticated)
app.get("/profile", private, async (req, res) => {
  const { email } = req.user;
  const userFind = await userSchema.findOne({ email }).populate("posts");
  res.render("profile", { userFind });
});

// Logout route
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

// Edit post page
app.get("/edit/:id", private, async (req, res) => {
  const { id } = req.params;
  const postFind = await postSchema.findById(id);
  res.render("edit", { postFind });
});

// Update post content
app.post("/updatePost/:id", private, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  await postSchema.findOneAndUpdate({ _id: id }, { content });
  res.redirect("/profile");
});

// Like or unlike a post
app.get("/like/:id", private, async (req, res) => {
  const { id } = req.params;
  const postFind = await postSchema.findById(id);
  if (postFind.likes.indexOf(req.user.user) == -1) {
    postFind.likes.push(req.user.user);
  } else {
    postFind.likes.splice(postFind.likes.indexOf(req.user.user), 1);
  }
  await postFind.save();
  res.redirect("/profile");
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
