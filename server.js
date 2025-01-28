const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

// In-memory user data (for demo purposes)
const users = [];

// Helper to find user by email
function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

// Routes
app.get('/', function (req, res) {
  const user = req.session.user || null; // Retrieve user data from the session
  res.render('index', { user }); // Pass 'user' to the template
});

// Route for rendering books.ejs
app.get('/books', (req, res) => {
    res.render('books.ejs');
  });

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (user && user.password === password) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.send('Invalid email or password. <a href="/">Go back</a>');
  }
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (findUserByEmail(email)) {
    res.send('User already exists. <a href="/">Go back</a>');
  } else {
    users.push({ name, email, password });
    req.session.user = { name, email };
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out. <a href="/">Go back</a>');
    }
    res.redirect('/');
  });
});

// Start the server
app.listen(PORT, function () {
  console.log(`Server is running successfully on port ${PORT}.`);
});
