const { db } = require("../util/admin");

const { validateCategoryData } = require("../util/validators");

exports.getPosts = (req, res) => {
  let collectionData = [];

  if (req.params.board === "all") {
    collectionData = db.collection("posts").orderBy("createdAt", "desc").get();
  } else {
    const { errors, valid } = validateCategoryData(req.params.board);
    if (!valid) return res.status(400).json({ errors });

    collectionData = db
      .collection("posts")
      .where("board", "==", req.params.board)
      .orderBy("createdAt", "desc")
      .get();
  }

  return collectionData
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        const postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });
      return res.json(posts);
    })
    .catch((err) => console.error(err));
};

exports.postNew = (req, res) => {
  const { errors, valid } = validateCategoryData(req.body.board);
  if (!valid) return res.status(400).json({ errors });

  const newPost = {
    userId: req.user.uid,
    userImage: req.user.imageUrl,
    title: req.body.title,
    board: req.body.board,
    description: req.body.description,
    contactInfo: req.body.contactInfo,
    createdAt: new Date().toISOString(),
  };

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      const resPost = newPost;
      resPost.postId = doc.id;
      res.json(resPost);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong." });
      console.error(err);
    });
};

exports.getPost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found." });
      }
      postData = doc.data();
      postData.postId = doc.id;
      return res.json(postData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found." });
      }
      if (doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized." });
      } else {
        document.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Post deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
