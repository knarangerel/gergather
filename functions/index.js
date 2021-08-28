const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const { db } = require("./util/admin");

const { getPosts, postNew, getPost, deletePost } = require("./handlers/posts");

const {
  signUp,
  logIn,
  getUser,
  uploadImage,
  updateProfile,
  getProfile,
} = require("./handlers/users");

// post routes
app.get("/posts/:board", getPosts);
app.post("/post", FBAuth, postNew);
app.get("/post/:postId", getPost);
app.delete("/post/:postId", FBAuth, deletePost);

// user routes
app.post("/signup", signUp);
app.post("/login", logIn);
app.get("/user/:userId", getUser);
app.get("/profile", FBAuth, getProfile);
app.post("/profile", FBAuth, updateProfile);
app.post("/profile/image", FBAuth, uploadImage);

exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
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
