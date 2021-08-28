const { db, admin } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignUpData,
  validateLogInData,
  validateCategoryData,
} = require("../util/validators");

exports.signUp = (req, res) => {
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json({ errors });

  const defaultImage = "default-pic.png";

  let token, userId;
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImage}?alt=media`,
      };
      db.doc(`/users/${userId}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return res.status(400).json({ email: "Email is already in use." });
      else
        return res
          .status(500)
          .json({ general: "Something went wrong. Please try again." });
    });
};

exports.logIn = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLogInData(user);
  if (!valid) return res.status(400).json({ errors });

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again." });
    });
};

exports.getUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.userId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found." });
      }
      userData = doc.data();
      userData.userId = doc.id;
      return res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getProfile = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("posts")
          .where("userId", "==", req.user.uid)
          .orderBy("createdAt", "desc")
          .get();
      }
    })
    .then((data) => {
      userData.posts = [];
      data.forEach((doc) => {
        const postData = doc.data();
        postData.postId = doc.id;
        userData.posts.push(postData);
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.updateProfile = (req, res) => {
  const { valid, errors } = validateCategoryData(req.body.category);
  if (!valid) return res.status(400).json({ errors });

  db.doc(`/users/${req.user.uid}`)
    .update(req.body)
    .then(() => {
      return res.json({ message: "Profile updated succesfully." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldName, file, fileName, encoding, mimeType) => {
    if (mimeType !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    const imageExtension = fileName.split(".")[fileName.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimeType };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimeType,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.uid}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully." });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};
