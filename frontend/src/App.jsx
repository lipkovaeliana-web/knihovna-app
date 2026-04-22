import { useEffect, useState } from "react";
import AddBookForm from "./components/Books/AddBookForm";
import BookList from "./components/Books/BookList";
import EditBookForm from "./components/Books/EditBookForm";
import "./App.css";

const API_BASE_URL = "https://knihovna-backend.onrender.com";

function App() {
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAuthor, setFilterAuthor] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previousPage, setPreviousPage] = useState(null);

  // Load books when filters change
  useEffect(() => {
    async function fetchBooks() {
      // Enable loading and clear previous error
      setLoading(true);
      setError("");

      try {
        let url = `${API_BASE_URL}/api/books/?`;

        // Filter by read / unread status
        if (filterStatus === "read") {
          url += "is_read=true&";
        } else if (filterStatus === "unread") {
          url += "is_read=false&";
        }

        // Filter by selected author
        if (filterAuthor !== "all") {
          url += `author=${filterAuthor}&`;
        }

        // Fetch books from backend
        const response = await fetch(url);

        // Handle failed response
        if (!response.ok) {
          throw new Error("Failed to load books.");
        }

        // Convert response to JSON
        const data = await response.json();

        // Save books and pagination links
        setBooks(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } catch (err) {
        // Save error message and reset book list
        setError(err.message || "An error occurred while loading books.");
        setBooks([]);
        setNextPage(null);
        setPreviousPage(null);
      } finally {
        // Disable loading state
        setLoading(false);
      }
    }

    fetchBooks();
  }, [filterStatus, filterAuthor]);

  // Load all authors from backend
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/authors/`);

        if (!response.ok) {
          throw new Error("Failed to load authors.");
        }

        const data = await response.json();

        // Support paginated and non-paginated responses
        setAuthors(data.results || data);
      } catch (err) {
        console.error("Error while loading authors:", err);
        setAuthors([]);
      }
    }

    fetchAuthors();
  }, []);

  // Add a new book
  const handleAddBook = async (book) => {
    if (!book.name || !book.author_ids?.length) {
      alert("Please enter a book title and select an author.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/books/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      alert("Error while adding book.");
      return;
    }

    const newBook = await response.json();

    setBooks((prevBooks) => [newBook, ...prevBooks]);
    setShowForm(false);
  };

  // Load next page of books
  const handleNextPage = async () => {
    if (!nextPage) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(nextPage);

      if (!response.ok) {
        throw new Error("Failed to load next page of books.");
      }

      const data = await response.json();

      setBooks(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (err) {
      setError(err.message || "An error occurred while loading next page.");
    } finally {
      setLoading(false);
    }
  };

  // Load previous page of books
  const handlePreviousPage = async () => {
    if (!previousPage) return;

    const response = await fetch(previousPage);
    const data = await response.json();

    setBooks(data.results);
    setNextPage(data.next);
    setPreviousPage(data.previous);
  };

  // Open book detail modal
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setIsEditing(false);
    setShowModal(true);
  };

  // Delete selected book
  const handleDeleteBook = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Error while deleting book.");
      return;
    }

    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));

    if (selectedBook?.id === id) {
      setSelectedBook(null);
      setIsEditing(false);
      setShowModal(false);
    }
  };

  // Update existing book
  const handleUpdateBook = async (updatedBook) => {
    const response = await fetch(
      `${API_BASE_URL}/api/books/${updatedBook.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      }
    );

    if (!response.ok) {
      alert("Error while updating book.");
      return;
    }

    const updated = await response.json();

    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updated.id ? updated : book))
    );
    setSelectedBook(updated);
    setIsEditing(false);
  };

  // Toggle read / unread status
  const handleToggleRead = async (book) => {
    const response = await fetch(
      `${API_BASE_URL}/api/books/${book.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_read: !book.is_read,
        }),
      }
    );

    if (!response.ok) {
      alert("Error while updating book status.");
      return;
    }

    const updated = await response.json();

    setBooks((prevBooks) =>
      prevBooks.map((item) => (item.id === updated.id ? updated : item))
    );

    if (selectedBook?.id === updated.id) {
      setSelectedBook(updated);
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <div className="app-logo"></div>

            <div className="app-brand-text">
              <h1 className="app-brand-title">Moje knihovna</h1>
              <p className="app-brand-subtitle">
                OSOBNÍ KNIHOVNA A PŘEHLED ČETBY
              </p>
            </div>
          </div>

          <button
            className="app-add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            ➕ Přidat knihu
          </button>
        </div>
      </header>

      <main className="container p-2 app-main">
        {/* Add new book form */}
        {showForm && <AddBookForm authors={authors} onAddBook={handleAddBook} />}

        {/* Filter section */}
        <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
          {/* Filter by read status */}
          <div className="filter-group">
            <label className="form-label fw-bold">Status</label>

            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Vše</option>
              <option value="read">Přečtené</option>
              <option value="unread">Nepřečtené</option>
            </select>
          </div>

          {/* Filter by author */}
          <div className="filter-group">
            <label className="form-label fw-bold">Autor</label>

            <select
              className="form-select"
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
            >
              <option value="all">Všichni autoři</option>
              {authors.map((author) => (
                <option key={author.id} value={String(author.id)}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading, error message, or book content */}
        {loading ? (
          <p className="loading-message">Načítám knihy...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {/* Book list */}
            <BookList
              books={books}
              onSelectBook={handleSelectBook}
              onDeleteBook={handleDeleteBook}
              onToggleRead={handleToggleRead}
            />

            {/* Pagination buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
              {previousPage && (
                <button className="btn-prev" onClick={handlePreviousPage}>
                  ← Předchozí
                </button>
              )}

              {nextPage && (
                <button className="btn-next" onClick={handleNextPage}>
                  Další →
                </button>
              )}
            </div>

            {/* Edit book form */}
            {isEditing && selectedBook && (
              <EditBookForm
                book={selectedBook}
                authors={authors}
                onUpdateBook={handleUpdateBook}
                onCancel={() => setIsEditing(false)}
              />
            )}

            {/* Book detail modal */}
            {showModal && selectedBook && (
              <div
                className="modal show fade d-block"
                tabIndex="-1"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="modal-dialog"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-content">
                    {/* Modal header */}
                    <div className="modal-header">
                      <h5 className="modal-title">{selectedBook.name}</h5>

                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>

                    {/* Modal body */}
                    <div className="modal-body">
                      <p>
                        <strong>Autor:</strong>{" "}
                        {selectedBook.author?.map((a) => a.name).join(", ")}
                      </p>

                      <p>
                        <strong>Jazyk:</strong> {selectedBook.language}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {selectedBook.is_read ? "Přečteno" : "Nepřečteno"}
                      </p>
                    </div>

                    {/* Modal action buttons */}
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Zavřít
                      </button>

                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setShowModal(false);
                          setIsEditing(true);
                        }}
                      >
                        ✏️ Upravit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Eliana Lipková</p>
        <div className="app-footer-links">
          <a
            href="https://www.elianalipkova.cz/kontakt.html"
            target="_blank"
            rel="noreferrer"
          >
            Kontaktuj mě
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;