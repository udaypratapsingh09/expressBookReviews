const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (isValid[username]){
        return res.status(404).json({ message: "Username already exists" });
    }
    else {
        users.push({username, password});
        return res.status(201).json({message: "User registered"});
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const foundBooks = await books;
  return res.status(300).json(foundBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const foundBook = await books[req.params.isbn]
  return res.status(300).json(foundBook);
 });
  
// Get book details based on author

const getAllBooksByAuthor = async (author) => {
  let b = {};
  Object.keys(books).forEach(key => {
    const book = books[key];
    if (book["author"]==author){
      b[key] = book;
    }
  })
  return b;
}

public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const b = await getAllBooksByAuthor(req.params.author);
  return res.status(300).json(b);
});

const getBookByTitle = async (title) => {
  let foundBook = null;
  Object.keys(books).forEach(key => {
    const book = books[key];
    if (book["title"]===title){
      foundBook = book;
      return;
    }
  })
  return foundBook;
}
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const book = await getBookByTitle(req.params.title);
  if (book)
    return res.status(200).json({message: "Book found", book});
  return res.status(300).json({message: "Not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn]["reviews"];
  if (reviews.length > 0){
    return res.status(200).json({message: "Reviews found", reviews});
  }

  return res.status(300).json({message: "This book has no reviews"});
});

module.exports.general = public_users;
