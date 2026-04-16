import { useEffect, useState } from "react";
import AddBookForm from "./components/Books/AddBookForm";
import BookList from "./components/Books/BookList";
import EditBookForm from "./components/Books/EditBookForm";
import "./App.css";

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

  useEffect(() => {
    async function fetchBooks() {
      let url = "http://localhost:8000/api/books/?";

      if (filterStatus === "read") {
        url += "is_read=true&";
      } else if (filterStatus === "unread") {
        url += "is_read=false&";
      }

      if (filterAuthor !== "all") {
        url += `author=${filterAuthor}&`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setBooks(data.results);
      setNextPage(data.next);
    }

    fetchBooks();
  }, [filterStatus, filterAuthor]);

  useEffect(() => {
    async function fetchAuthors() {
      const response = await fetch("http://localhost:8000/api/authors/");
      const data = await response.json();
      setAuthors(data.results);
    }

    fetchAuthors();
  }, []);

  const handleAddBook = async (book) => {
    if (!book.name || !book.author_ids?.length) {
      alert("Vyplňte název knihy a vyberte autora.");
      return;
    }

    const response = await fetch("http://localhost:8000/api/books/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      alert("Chyba při přidávání knihy.");
      return;
    }

    const newBook = await response.json();

    setBooks((prevBooks) => [newBook, ...prevBooks]);
    setShowForm(false);
  };

  const handleNextPage = async () => {
    if (!nextPage) return;

    const response = await fetch(nextPage);
    const data = await response.json();
    setBooks(data.results);
    setNextPage(data.next);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDeleteBook = async (id) => {
    const response = await fetch(`http://localhost:8000/api/books/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Chyba při mazání knihy");
      return;
    }

    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));

    if (selectedBook?.id === id) {
      setSelectedBook(null);
      setIsEditing(false);
      setShowModal(false);
    }
  };

  const handleUpdateBook = async (updatedBook) => {
    const response = await fetch(
      `http://localhost:8000/api/books/${updatedBook.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      }
    );

    if (!response.ok) {
      alert("Chyba při aktualizaci knihy");
      return;
    }

    const updated = await response.json();

    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updated.id ? updated : book))
    );
    setSelectedBook(updated);
    setIsEditing(false);
  };

  const handleToggleRead = async (book) => {
    const response = await fetch(
      `http://localhost:8000/api/books/${book.id}/`,
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
      alert("Chyba při změně statusu knihy");
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
          className="btn app-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          ➕ Přidat knihu
        </button>
      </div>
    </header>

    <main className="container p-2 app-main">
      {showForm && (
        <AddBookForm
          authors={authors}
          onAddBook={handleAddBook}
        />
      )}
<div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
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

      <BookList
        books={books}
        onSelectBook={handleSelectBook}
        onDeleteBook={handleDeleteBook}
        onToggleRead={handleToggleRead}
      />

      {nextPage && (
        <button
          className="btn btn-outline-primary mt-3"
          onClick={handleNextPage}
        >
          Načíst další
        </button>
      )}

      {isEditing && selectedBook && (
        <EditBookForm
          book={selectedBook}
          authors={authors}
          onUpdateBook={handleUpdateBook}
          onCancel={() => setIsEditing(false)}
        />
      )}

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
              <div className="modal-header">
                <h5 className="modal-title">{selectedBook.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

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