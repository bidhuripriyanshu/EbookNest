import Books from "../model/books.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBook = async (req, res) => {
    try {
        const transactions = await Books.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Books fetched successfully",
            data: transactions
        });
    } catch (err) {
        res.json({ success: false, message: "Failed to fetch books", error: err.message });

    }
}

const postBook = async (req, res) => {
    const book = new Books(req.body);
    try {
        await book.save();
        res.json({ success: true, message: "Book added successfully", data: book });
    } catch (err) {
        res.json({ success: false, message: "Failed to add book", error: err.message });
    }
}

const searchBooks = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({ 
                success: false, 
                message: "Search query is required" 
            });
        }

        const searchRegex = new RegExp(q, 'i');
        const books = await Books.find({
            $or: [
                { title: searchRegex },
                { author: searchRegex },
                { category: searchRegex }
            ]
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Search completed successfully",
            data: books
        });
    } catch (err) {
        res.json({ 
            success: false, 
            message: "Failed to search books", 
            error: err.message 
        });
    }
}

// New function to get BookAPI.json data
const getBookAPIData = async (req, res) => {
    try {
        // Path to the BookAPI.json file in the client directory
        const bookAPIPath = path.join(__dirname, '../../Client/src/BookAPI.json');
        
        // Read the JSON file
        const bookAPIData = fs.readFileSync(bookAPIPath, 'utf8');
        const parsedData = JSON.parse(bookAPIData);
        
        res.json({
            success: true,
            message: "BookAPI data fetched successfully",
            data: parsedData.ebooks
        });
    } catch (err) {
        console.error('Error reading BookAPI.json:', err);
        res.json({ 
            success: false, 
            message: "Failed to fetch BookAPI data", 
            error: err.message 
        });
    }
}

// Function to import BookAPI.json data into database
const importBookAPIData = async (req, res) => {
    try {
        const bookAPIPath = path.join(__dirname, '../../Client/src/BookAPI.json');
        const bookAPIData = fs.readFileSync(bookAPIPath, 'utf8');
        const parsedData = JSON.parse(bookAPIData);
        
        let importedCount = 0;
        let skippedCount = 0;
        
        for (const book of parsedData.ebooks) {
            try {
                // Check if book already exists (by title and author)
                const existingBook = await Books.findOne({
                    title: book.title,
                    author: book.author
                });
                
                if (!existingBook) {
                    // Transform BookAPI format to your database schema
                    const transformedBook = {
                        title: book.title,
                        author: book.author,
                        isbn: book.isbn,
                        language: book.language,
                        category: book.category || 'General',
                        price: Math.floor(Math.random() * 500) + 100, // Random price
                        image_url: book.image_url,
                        description: book.description,
                        publish_year: book.publication_year,
                        genre: book.genre
                    };
                    
                    const newBook = new Books(transformedBook);
                    await newBook.save();
                    importedCount++;
                } else {
                    skippedCount++;
                }
            } catch (error) {
                console.error(`Error importing book ${book.title}:`, error);
                skippedCount++;
            }
        }
        
        res.json({
            success: true,
            message: `Import completed. ${importedCount} books imported, ${skippedCount} skipped.`,
            data: {
                imported: importedCount,
                skipped: skippedCount
            }
        });
    } catch (err) {
        console.error('Error importing BookAPI data:', err);
        res.json({ 
            success: false, 
            message: "Failed to import BookAPI data", 
            error: err.message 
        });
    }
}

export {
    getBook,
    postBook,
    searchBooks,
    getBookAPIData,
    importBookAPIData
}

