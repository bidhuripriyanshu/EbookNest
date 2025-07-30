import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Book API functions
export const bookAPI = {
  // Get all books
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  // Get single book by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Add new book
  addBook: async (bookData) => {
    const response = await api.post('/book', bookData);
    return response.data;
  },

  // Update book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // Search books
  searchBooks: async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get BookAPI.json data
  getBookAPIData: async () => {
    const response = await api.get('/books/api-data');
    return response.data;
  },

  // Import BookAPI.json data into database
  importBookAPIData: async () => {
    const response = await api.post('/books/import-api-data');
    return response.data;
  }
};

// OpenLibrary API functions
export const openLibraryAPI = {
  // Search books from OpenLibrary
  searchBooks: async (query) => {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.docs || []; // Returns an array of book results
    } catch (error) {
      console.error('Error fetching books from OpenLibrary:', error);
      return [];
    }
  },

  // Get book details by OpenLibrary ID
  getBookDetails: async (openLibraryId) => {
    try {
      const response = await fetch(`https://openlibrary.org/works/${openLibraryId}.json`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  },

  // Get author details
  getAuthorDetails: async (authorId) => {
    try {
      const response = await fetch(`https://openlibrary.org/authors/${authorId}.json`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching author details:', error);
      return null;
    }
  },

  // Transform OpenLibrary book to your format
  transformBookData: (openLibraryBook) => {
    return {
      title: openLibraryBook.title || 'Unknown Title',
      author: openLibraryBook.author_name ? openLibraryBook.author_name.join(', ') : 'Unknown Author',
      category: openLibraryBook.subject ? openLibraryBook.subject.slice(0, 3).join(', ') : 'General',
      language: openLibraryBook.language ? openLibraryBook.language[0] : 'en',
      price: Math.floor(Math.random() * 500) + 100, // Random price between 100-600
      image_url: openLibraryBook.cover_i 
        ? `https://covers.openlibrary.org/b/id/${openLibraryBook.cover_i}-L.jpg`
        : 'https://thecharulathapublications.com/wp-content/uploads/2022/11/book-placeholder.png',
      description: openLibraryBook.first_sentence ? openLibraryBook.first_sentence[0] : 'No description available',
      publish_year: openLibraryBook.first_publish_year || new Date().getFullYear(),
      isbn: openLibraryBook.isbn ? openLibraryBook.isbn[0] : null,
      openlibrary_id: openLibraryBook.key
    };
  }
};

// User API functions
export const userAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  // Register user
  signup: async (userData) => {
    const response = await api.post('/signup', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  }
};

export default api; 