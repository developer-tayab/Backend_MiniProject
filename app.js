// Importing required modules
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const userSchema = require("./models/user.models");
const postSchema = require("./models/post.models");
const jwt = require("jsonwebtoken");

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes and Controllers

// Home route
app.get("/", (req, res) => {
  res.render("home");// Renders home page
});

// Create a new user (sign-up)
app.post("/create", async (req, res) => {
  const { username, name, email, password, age } = req.body;

  // Check if the user already exists
  const userFind = await userSchema.findOne({ email });
  if (userFind) return res.send("User already exists");

  // Hash password and create user
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, async (error, hash) => {
      const userCreate = await userSchema.create({ username, name, email, password: hash, age });

      // Generate JWT token and set cookie
      const token = jwt.sign({ email }, "shaaa");
      res.cookie("token", token);
      console.log(userCreate, "User created successfully");

      // Redirect to login page
      res.redirect("/login");
    });
  });
});

// Login page route
app.get("/login", (req, res) => {
  res.render("login"); // Renders login page
});

// Login authentication
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  // Check if the user exists
  const userFind = await userSchema.findOne({ email });
  if (!userFind) return res.redirect("/login");

  // Compare password with stored hash
  bcrypt.compare(password, userFind.password, (error, result) => {
    if (!result) return res.redirect("/login");

    // Generate JWT token and set cookie
    const token = jwt.sign({ email }, "shaaa");
    res.status(200);
    res.cookie("token", token);

    // Redirect to profile page
    res.redirect("/profile");
    console.log("Login is done.");
  });
});

// Create a new post (authenticated)
app.post("/createPost", private, async (req, res) => {
  const { content } = req.body;
  const { email } = req.user;

  // Find the user and create a post
  const FindUser = await userSchema.findOne({ email });
  const postCreate = await postSchema.create({ user: FindUser._id, content });

  // Add post to user's posts
  FindUser.posts.push(postCreate._id);
  const save = await FindUser.save();
  console.log(save);

  // Redirect to profile page
  res.redirect("/profile");
});

// Private middleware to check authentication
function private(req, res, next) {
  if (req.cookies.token == "") res.redirect("/login");
  else {
    const data = jwt.verify(req.cookies.token, "shaaa");
    req.user = data; // Attach user data to the request object
    next(); // Call the next middleware
  }
}

// Profile route (authenticated)
app.get("/profile", private, async (req, res) => {
  const { email } = req.user;

  // Find the user and populate posts
  const userFind = await userSchema.findOne({ email }).populate("posts");

  // Render profile page
  res.render("profile", { userFind });
});

// Logout route
app.get("/logout", (req, res) => {
  // Clear the cookie
  res.cookie("token", "");
  console.log("Logout is done.");

  // Redirect to home page
  res.redirect("/");
});

app.get("/edit/:id", private, async (req, res) => {
  const { id } = req.params;
  const postFind = await postSchema.findById(id);
  res.render("edit", { postFind })
})

app.post("/updatePost/:id", private, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  await postSchema.findOneAndUpdate({ _id: id }, { content });
  // Redirect to profile page
  res.redirect("/profile");
})

app.get("/like/:id", private, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const postFind = await postSchema.findById(id);
  if(postFind.likes.indexOf(req.user.user) == -1){
    postFind.likes.push(req.user.user);
    await postFind.save();
    res.redirect("/profile");
  }else{
    postFind.likes.splice(postFind.likes.indexOf(req.user.user), 1);
    await postFind.save();
    res.redirect("/profile");
  }

});

// Starting the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
