const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 return username && username.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find((user) => user.username === username && user.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"})
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
        { username: username },
        "fingerprint_customer",  
        { expiresIn: '1h' }
      );
  
      req.session.authorization = {
        accessToken
      }
  
      return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password." });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!review) {
    return res.status(400).json({message: "Review is required"})
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review successfully updated!"})
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
