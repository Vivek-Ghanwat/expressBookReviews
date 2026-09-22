const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Promises / Async-Await
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((bks) => {
    res.status(200).send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(500).json({message: err});
  });
});

// Task 11: Get book details based on ISBN using Promises / Async-Await
public_users.get('/isbn/:isbn', function (req, res) {
  const get_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  get_isbn.then((book) => {
    res.status(200).send(JSON.stringify(book, null, 4));
  }).catch((err) => {
    res.status(404).json({message: err});
  });
});
  
// Task 12: Get book details based on author using Promises / Async-Await
public_users.get('/author/:author', function (req, res) {
  const get_author = new Promise((resolve, reject) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    let matchingBooks = [];
    for (let key of keys) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for this author");
    }
  });
  get_author.then((bks) => {
    res.status(200).send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(404).json({message: err});
  });
});

// Task 13: Get all books based on title using Promises / Async-Await
public_users.get('/title/:title', function (req, res) {
  const get_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    let matchingBooks = [];
    for (let key of keys) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title");
    }
  });
  get_title.then((bks) => {
    res.status(200).send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(404).json({message: err});
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
