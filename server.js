const express = require('express');
const app = express();
const path = require('path');
const usermodel = require('./models/user.js'); // Ensure the path and model are correct.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the homepage
app.get('/', function (req, res) {
    res.render("index")
});

// Route for rendering book.ejs
app.get("/books", (req, res) => {
    // Sample book data
    // const books = [
    //   { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    //   { title: "To Kill a Mockingbird", author: "Harper Lee" },
    //   { title: "1984", author: "George Orwell" },
    //   { title: "Moby Dick", author: "Herman Melville" },
    // ];
  
    res.render("books.ejs");
  });

app.listen(3000, function () {
    console.log("Server is running successfully on port 3000.");
});