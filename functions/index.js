const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const { db } = require("./util/admin");

const {
  getAllPosts,
  postNew,
  getPost,
  deletePost,
} = require("./handlers/posts");

const {
  signUp,
  logIn,
  uploadImage,
  updateProfile,
  getProfile,
} = require("./handlers/users");

// post routes
app.get("/posts", getAllPosts); // board selection and push op
app.post("/post", FBAuth, postNew); //
app.get("/post/:postId", getPost); //
app.delete("/post/:postId", FBAuth, deletePost); //
// TODO: Edit post functionality ?

// user routes
app.post("/signup", signUp); //
app.post("/login", logIn); // error handling?
app.get("/user", FBAuth, getProfile); // push op
app.post("/user", FBAuth, updateProfile); // board selection
app.post("/user/image", FBAuth, uploadImage); //
// TODO: View someone else's profile ?
// app.get("user/:userId", viewProfile)

// TODO: debug
exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection("posts")
        .where("userId", "==", change.before.id)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, {
              userImage: change.after.data().imageUrl,
            });
          });
          return batch.commit();
        });
    }
  });

exports.api = functions.https.onRequest(app);
