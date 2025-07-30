import React, { useState } from 'react';
import { openLibraryAPI } from '../../services/api';
import './OpenLibraryDemo.css';

function OpenLibraryDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Your original function integrated with the API service
  const searchBooks = async (query) => {
    try {
      setLoading(true);
      const books = await openLibraryAPI.searchBooks(query);
      setBooks(books);
      console.log(`Found ${books.length} books for query: ${query}`);
      return books;
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    await searchBooks(searchQuery);
  };

  const handleExampleSearch = (example) => {
    setSearchQuery(example);
    searchBooks(example);
  };

  return (
    <div className="open-library-demo">
      <div className="demo-header">
        <h2>OpenLibrary API Demo</h2>
        <p>Search for books using the OpenLibrary API</p>
      </div>

      <div className="search-section">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter book title, author, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="example-searches">
          <p>Try these examples:</p>
          <div className="example-buttons">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleExampleSearch('harry potter')}
            >
              Harry Potter
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleExampleSearch('javascript')}
            >
              JavaScript
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleExampleSearch('python')}
            >
              Python
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleExampleSearch('react')}
            >
              React
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Searching OpenLibrary...</p>
        </div>
      )}

      {books.length > 0 && (
        <div className="results-section">
          <h3>Search Results ({books.length} books found)</h3>
          <div className="books-list">
            {books.slice(0, 10).map((book, index) => (
              <div key={book.key || index} className="book-item">
                <div className="book-cover">
                  <img 
                    src={book.cover_i 
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
                      : 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png'
                    } 
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png';
                    }}
                  />
                </div>
                <div className="book-details">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">
                    <strong>Author:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown'}
                  </p>
                  <p className="book-year">
                    <strong>Year:</strong> {book.first_publish_year || 'Unknown'}
                  </p>
                  <p className="book-subjects">
                    <strong>Subjects:</strong> {book.subject ? book.subject.slice(0, 3).join(', ') : 'None'}
                  </p>
                  {book.isbn && (
                    <p className="book-isbn">
                      <strong>ISBN:</strong> {book.isbn[0]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {books.length > 10 && (
            <p className="more-results">
              Showing first 10 results. Total: {books.length} books found.
            </p>
          )}
        </div>
      )}

      <div className="api-info">
        <h4>API Information</h4>
        <ul>
          <li><strong>Endpoint:</strong> https://openlibrary.org/search.json</li>
          <li><strong>Query Parameter:</strong> q (search query)</li>
          <li><strong>Response:</strong> JSON with book metadata</li>
          <li><strong>Cover Images:</strong> Available via cover_i field</li>
        </ul>
      </div>
    </div>
  );
}

export default OpenLibraryDemo; 