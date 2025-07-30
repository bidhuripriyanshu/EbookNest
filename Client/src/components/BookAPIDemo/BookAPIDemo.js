import React, { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import './BookAPIDemo.css';

function BookAPIDemo() {
  const [bookAPIData, setBookAPIData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBookAPIData();
  }, []);

  const fetchBookAPIData = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getBookAPIData();
      
      if (response.success) {
        setBookAPIData(response.data);
        console.log('BookAPI data loaded:', response.data);
      } else {
        console.error('Failed to load BookAPI data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching BookAPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleImportBook = async (book) => {
    try {
      // Transform BookAPI format to your database schema
      const transformedBook = {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        language: book.language,
        category: book.category || 'General',
        price: Math.floor(Math.random() * 500) + 100,
        image_url: book.image_url,
        description: book.description,
        publish_year: book.publication_year,
        genre: book.genre
      };
      
      const response = await bookAPI.addBook(transformedBook);
      
      if (response.success) {
        alert(`"${book.title}" imported successfully!`);
      } else {
        alert('Failed to import book: ' + response.message);
      }
    } catch (error) {
      console.error('Error importing book:', error);
      alert('Failed to import book');
    }
  };

  return (
    <div className="book-api-demo">
      <div className="demo-header">
        <h2>BookAPI.json Demo</h2>
        <p>Displaying books from your BookAPI.json file</p>
      </div>

      <div className="demo-controls">
        <button 
          className="btn btn-primary"
          onClick={fetchBookAPIData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
        <span className="book-count">
          {bookAPIData.length} books available
        </span>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading BookAPI data...</p>
        </div>
      ) : bookAPIData.length === 0 ? (
        <div className="no-data">
          <p>No BookAPI data available</p>
        </div>
      ) : (
        <div className="books-container">
          <div className="books-grid">
            {bookAPIData.map((book, index) => (
              <div 
                key={book.id || index} 
                className="book-card"
                onClick={() => handleBookClick(book)}
              >
                <div className="book-cover">
                  <img 
                    src={book.image_url || 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png'} 
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png';
                    }}
                  />
                </div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="book-details">
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p className="book-details">
                    <strong>Year:</strong> {book.publication_year}
                  </p>
                  <p className="book-details">
                    <strong>Language:</strong> {book.language}
                  </p>
                  {book.isbn && (
                    <p className="book-details">
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                  )}
                  <p className="book-description">
                    {book.description?.substring(0, 80)}...
                  </p>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImportBook(book);
                    }}
                  >
                    Import to Database
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="book-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedBook.title}</h3>
              <button 
                className="btn-close"
                onClick={() => setSelectedBook(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="book-detail-grid">
                <div className="book-cover-large">
                  <img 
                    src={selectedBook.image_url || 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png'} 
                    alt={selectedBook.title}
                    onError={(e) => {
                      e.target.src = 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png';
                    }}
                  />
                </div>
                <div className="book-details-full">
                  <h4>{selectedBook.title}</h4>
                  <p><strong>Author:</strong> {selectedBook.author}</p>
                  <p><strong>Genre:</strong> {selectedBook.genre}</p>
                  <p><strong>Publication Year:</strong> {selectedBook.publication_year}</p>
                  <p><strong>Language:</strong> {selectedBook.language}</p>
                  {selectedBook.isbn && (
                    <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                  )}
                  {selectedBook.category && (
                    <p><strong>Category:</strong> {selectedBook.category}</p>
                  )}
                  <div className="book-description-full">
                    <strong>Description:</strong>
                    <p>{selectedBook.description}</p>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      handleImportBook(selectedBook);
                      setSelectedBook(null);
                    }}
                  >
                    Import to Database
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="api-info">
        <h4>BookAPI.json Information</h4>
        <ul>
          <li><strong>Source:</strong> Local BookAPI.json file</li>
          <li><strong>Total Books:</strong> {bookAPIData.length}</li>
          <li><strong>Format:</strong> JSON with book metadata</li>
          <li><strong>Features:</strong> Title, Author, ISBN, Genre, Description, Image</li>
        </ul>
      </div>
    </div>
  );
}

export default BookAPIDemo; 