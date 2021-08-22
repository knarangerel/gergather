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
        });
      });
      return res.json(posts);
    })
    .catch((err) => console.error(err));
};

exports.postNew = (req, res) => {
  // TODO: validation of post input

  const newPost = {
    userId: req.user.uid,
    title: req.body.title,
    description: req.body.description,
    board: req.body.board,
    contactInfo: req.body.contactInfo,
    createdAt: new Date().toISOString(),
  };

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      res.json({ message: `Document ${doc.id} created successfully.` });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong." });
      console.error(err);
    });
};
