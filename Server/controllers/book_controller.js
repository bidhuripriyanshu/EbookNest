import Books from "../model/books.js";

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

export {
    getBook,
    postBook,
    searchBooks
}

