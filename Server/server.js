import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import mongoose from 'mongoose';
import { getBook, postBook } from './controllers/book_controller.js';
import { postLogin, postSignup } from './controllers/User.js';
// const booksRouter = require('./routes/books');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://ebook-platform-online-icy6.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});


try {
    mongoose.connect(process.env.DB_URL)
    console.log('Connected to MongoDB')
}
catch (err) {
    console.error('Error connecting to MongoDB:', err)
}



app.get("/", (req, res) => {
    res.send("Hello, server is ready!");
})

app.get("/books", getBook)
app.post("/book", postBook)
app.post("/signup", postSignup)
app.post("/login",postLogin)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
