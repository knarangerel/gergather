const { db } = require("../util/admin");

exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push({
          postId: doc.id,
          user: doc.data().user,
          title: doc.data().title,
          board: doc.data().board,
          description: doc.data().description,
          contactInfo: doc.data().contactInfo,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
        });
      });
      return res.json(posts);
    })
    .catch((err) => console.error(err));
};

exports.postNew = (req, res) => {
  // TODO: validation of post input, board validation
  const newPost = {
    userId: req.user.uid,
    userImage: req.user.imageUrl,
    title: req.body.title,
    description: req.body.description,
    board: req.body.board,
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
      return res.json({ message: "Post deleted succesfully." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
