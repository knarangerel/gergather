const functions = require("firebase-functions");

const app = require("express")();

const FBAuth = require("./util/fbAuth");

const { getAllPosts, postNew } = require("./handlers/posts");
const { signUp, logIn } = require("./handlers/users");

// post routes
app.get("/posts", getAllPosts);
app.post("/post", FBAuth, postNew);

// user routes
app.post("/signup", signUp);
app.post("/login", logIn);

exports.api = functions.https.onRequest(app);
