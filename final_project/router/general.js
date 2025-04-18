const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn  = req.params.isbn;
  const book = books[isbn];

  if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
   const author = req.params.author;
    const booksByAuthor = [];

    for (const key in books) {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = []

  for (const key in books){
    if (books[key].title === title) {
        booksByTitle.push(books[key])
    }
  }
  if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
  } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
