// Reference Document ONLY

const { signUp } = require("./handlers/users");

let db = {
  posts: {
    userId: "user",
    userImage:
      "https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImage}?alt=media",
    title: "title",
    board: "board",
    description: "description",
    contactInfo: "contactInfo",
    createdAt: "2021-08-22T05:01:56.175Z",
  },
  users: {
    firstName: "First",
    lastName: "Last",
    email: "user@email.com",
    createdAt: "2021-08-22T19:49:29.668Z",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImage}?alt=media",

    // profile additions
    bio: "Hello! This is my bio.",
    location: "Boston, MA",
    category: "University",
    contactInfo: "617-500-0000",
  },
};

// getProfile response
const userData = {
  credentials: {
    userId: "",
    email,
  },
  posts: [...posts],
};

// signup
// login
// {
//   "firstName": "name",
//   "lastName": "name",
//   "email": "vic@gmail.com",
//   "password": "victoria",
//   "confirmPassword": "victoria"
// }

// login
// {
//   "email": "vic@gmail.com",
//   "password": "victoria"
// }

// post
// {
//     "title": "new title",
//     "board": "other",
//     "description": "desc",
//     "contactInfo": "contact by email"
// }
