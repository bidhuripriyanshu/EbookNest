import React, { useEffect, useState } from 'react'
import './Books.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Bookcards from '../../components/Bookscard/Bookcards'
import OpenLibrarySearch from '../../components/OpenLibrarySearch/OpenLibrarySearch'
import BookAPIManager from '../../components/BookAPIManager/BookAPIManager'
import { bookAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function Books() {
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([])
  const [visibleBooks, setVisibleBooks] = useState(10)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showOpenLibrarySearch, setShowOpenLibrarySearch] = useState(false)
  const [showBookAPIManager, setShowBookAPIManager] = useState(false)

  const getBook = async () => {
    try {
      setLoading(true)
      toast.loading("Loading Books")

      const response = await bookAPI.getAllBooks()
      
      if (response.success) {
        setTimeout(() => {
          toast.dismiss()
          toast.success("Books fetched successfully")
          setBooks(response.data)
          setFilteredBooks(response.data)
        }, 1000);
      } else {
        toast.error(response.message || "Failed to fetch books")
      }
    }
    catch (err) {
      console.error("API Error:", err)
      toast.error(err.response?.data?.message || "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const searchTerm = e.target.value
    setSearchTerm(searchTerm)
    
    if (!searchTerm.trim()) {
      setFilteredBooks(books)
      return
    }
    
    const filteredBooks = books.filter((book) => {
      return (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    })
    setFilteredBooks(filteredBooks)
  }

  const loadMore = () => {
    setVisibleBooks(visibleBooks + 10)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    getBook();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid mt-4">
        <div className='search-field mt-5 pt-2'>
          <h3 className='text-center mb-3'>Search Books By Category</h3>
          <div className="w-100">
            <ul className="list-inline p-0 gap-4 d-flex flex-wrap justify-content-center search-menu-options">
              <li className="search-menu-opt">
                <select className="form-control form-select form-search-control bg-white border-0" onChange={handleSearch}>
                  <option value="">All</option>
                  <option value="author">Author</option>
                  <option value="title">Title</option>
                </select>
              </li>
              <li className="search-menu-opt">
                <input 
                  type="text" 
                  className="form-control form-search-control bg-white border-0" 
                  onChange={handleSearch} 
                  placeholder="Search books..." 
                  value={searchTerm}
                />
              </li>
              {user && user.role === 'admin' && (
                <>
                  <li className="search-menu-opt">
                    <Link to='/add/book' className="btn btn-danger">Add New Book</Link>
                  </li>
                  <li className="search-menu-opt">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowOpenLibrarySearch(true)}
                    >
                      Import from OpenLibrary
                    </button>
                  </li>
                  <li className="search-menu-opt">
                    <button 
                      className="btn btn-success"
                      onClick={() => setShowBookAPIManager(true)}
                    >
                      Import from BookAPI
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className='container p-4 shadow'>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-5">
              <h5>No books found</h5>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="books-list row-cols-1 row row-cols-xl-5 row-cols-md-4 g-4">
                {
                  filteredBooks.slice(0, visibleBooks).map((book, i) => (
                    <Bookcards key={book._id || i} {...book} getBook={getBook} />
                  ))
                }
              </div>
              <div className='d-flex mt-4 justify-content-center'>
                {visibleBooks < filteredBooks.length && (
                  <button className="btn btn-danger" onClick={loadMore}>
                    Load More ({filteredBooks.length - visibleBooks} remaining)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* OpenLibrary Search Modal */}
      {showOpenLibrarySearch && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <OpenLibrarySearch 
              onBookAdded={getBook}
              onClose={() => setShowOpenLibrarySearch(false)}
            />
          </div>
        </div>
      )}

      {/* BookAPI Manager Modal */}
      {showBookAPIManager && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <BookAPIManager 
              onBooksImported={getBook}
              onClose={() => setShowBookAPIManager(false)}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </>
  )
}

export default Books