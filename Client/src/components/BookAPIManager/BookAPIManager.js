import React, { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './BookAPIManager.css';

function BookAPIManager({ onBooksImported, onClose }) {
  const [bookAPIData, setBookAPIData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchBookAPIData();
  }, []);

  const fetchBookAPIData = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getBookAPIData();
      
      if (response.success) {
        setBookAPIData(response.data);
        toast.success(`Loaded ${response.data.length} books from BookAPI`);
      } else {
        toast.error(response.message || 'Failed to load BookAPI data');
      }
    } catch (error) {
      console.error('Error fetching BookAPI data:', error);
      toast.error('Failed to load BookAPI data');
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = async () => {
    try {
      setImporting(true);
      toast.loading('Importing books from BookAPI...');
      
      const response = await bookAPI.importBookAPIData();
      
      toast.dismiss();
      
      if (response.success) {
        toast.success(response.message);
        if (onBooksImported) {
          onBooksImported();
        }
      } else {
        toast.error(response.message || 'Failed to import books');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error importing BookAPI data:', error);
      toast.error('Failed to import books');
    } finally {
      setImporting(false);
    }
  };

  const handleImportSingle = async (book) => {
    try {
      setImporting(true);
      
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
        toast.success(`"${book.title}" imported successfully!`);
        if (onBooksImported) {
          onBooksImported();
        }
      } else {
        toast.error(response.message || 'Failed to import book');
      }
    } catch (error) {
      console.error('Error importing book:', error);
      toast.error('Failed to import book');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="book-api-manager">
      <div className="manager-header">
        <h3>BookAPI Data Manager</h3>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      <div className="manager-actions">
        <button 
          className="btn btn-success"
          onClick={handleImportAll}
          disabled={importing || bookAPIData.length === 0}
        >
          {importing ? 'Importing...' : `Import All (${bookAPIData.length})`}
        </button>
        <button 
          className="btn btn-outline-primary"
          onClick={fetchBookAPIData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {loading ? (
        <div className="loading-section">
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
        <div className="books-section">
          <h4>Available Books ({bookAPIData.length})</h4>
          <div className="books-grid">
            {bookAPIData.map((book, index) => (
              <div key={book.id || index} className="book-card">
                <div className="book-image">
                  <img 
                    src={book.image_url || 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png'} 
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png';
                    }}
                  />
                </div>
                <div className="book-info">
                  <h5 className="book-title">{book.title}</h5>
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
                    {book.description?.substring(0, 100)}...
                  </p>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleImportSingle(book)}
                    disabled={importing}
                  >
                    Import This Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="api-info">
        <h4>BookAPI Information</h4>
        <ul>
          <li><strong>Source:</strong> BookAPI.json file</li>
          <li><strong>Total Books:</strong> {bookAPIData.length}</li>
          <li><strong>Format:</strong> JSON with book metadata</li>
          <li><strong>Features:</strong> Title, Author, ISBN, Genre, Description</li>
        </ul>
      </div>
    </div>
  );
}

export default BookAPIManager; 