import React, { useState } from 'react';
import { openLibraryAPI, bookAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './OpenLibrarySearch.css';

function OpenLibrarySearch({ onBookAdded, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(new Set());

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const books = await openLibraryAPI.searchBooks(searchQuery);
      setSearchResults(books.slice(0, 20)); // Limit to 20 results
      toast.success(`Found ${books.length} books`);
    } catch (error) {
      toast.error('Failed to search books');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const handleImportSelected = async () => {
    if (selectedBooks.size === 0) {
      toast.error('Please select at least one book');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const bookId of selectedBooks) {
      try {
        const book = searchResults.find(b => b.key === bookId);
        if (book) {
          const transformedBook = openLibraryAPI.transformBookData(book);
          await bookAPI.addBook(transformedBook);
          successCount++;
        }
      } catch (error) {
        console.error('Error importing book:', error);
        errorCount++;
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} book(s)`);
      if (onBookAdded) onBookAdded();
    }
    
    if (errorCount > 0) {
      toast.error(`Failed to import ${errorCount} book(s)`);
    }

    setSelectedBooks(new Set());
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleImportSingle = async (book) => {
    try {
      setLoading(true);
      const transformedBook = openLibraryAPI.transformBookData(book);
      await bookAPI.addBook(transformedBook);
      toast.success('Book imported successfully!');
      if (onBookAdded) onBookAdded();
    } catch (error) {
      toast.error('Failed to import book');
      console.error('Import error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="open-library-search">
      <div className="search-header">
        <h3>Search OpenLibrary</h3>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      <div className="search-input-section">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search for books (e.g., Harry Potter, JavaScript, etc.)"
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
      </div>

      {searchResults.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h5>Search Results ({searchResults.length})</h5>
            {selectedBooks.size > 0 && (
              <button 
                className="btn btn-success btn-sm"
                onClick={handleImportSelected}
                disabled={loading}
              >
                Import Selected ({selectedBooks.size})
              </button>
            )}
          </div>

          <div className="books-grid">
            {searchResults.map((book) => (
              <div key={book.key} className="book-card">
                <div className="book-image">
                  <img 
                    src={book.cover_i 
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png'
                    } 
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png';
                    }}
                  />
                </div>
                <div className="book-info">
                  <h6 className="book-title">{book.title}</h6>
                  <p className="book-author">
                    {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
                  </p>
                  <p className="book-year">
                    {book.first_publish_year || 'Year unknown'}
                  </p>
                  <div className="book-actions">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedBooks.has(book.key)}
                        onChange={() => handleBookSelect(book.key)}
                      />
                      <span className="checkmark"></span>
                      Select
                    </label>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleImportSingle(book)}
                      disabled={loading}
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpenLibrarySearch; 