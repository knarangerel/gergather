const { db } = require("../util/admin");

const config = require("../util/config");

const { validateSignUpData, validateLogInData } = require("../util/validators");

const firebase = require("firebase");
firebase.initializeApp(config);

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  // input validation
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json({ errors });

  // user sign up
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
        email: newUser.email,
        createdAt: new Date().toISOString(),
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
      else return res.status(500).json({ error: err.code });
    });
};

exports.logIn = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  // input validation
  const { valid, errors } = validateLogInData(user);
  if (!valid) return res.status(400).json({ errors });

  // user log in
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
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again." });
      } else return res.status(500).json({ error: err.code });
    });
};
