// Reference Document ONLY

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

// post
// {
//     "title": "new title",
//     "board": "other",
//     "description": "desc",
//     "contactInfo": "contact by email"
// }

// signup
// {
//     "email": "",
//     "password": "",
//     "confirmPassword": ""
// }

// login
// {
//     "email": "",
//     "password": "",
// }

// TODO:
// Test every function thoroughly
// Hook up React
// Create every page with minimal styling to test full functionality
//    sign up and login
//    post pages (all posts, posts by board, new post, single post view (as owner and as visitor))
//    user pages (owner profile view (view with posts and edit), visitor profile view)
// Add styling
