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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">📚 Moje knihovna</h1>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          ➕ Přidat knihu
        </button>
      </div>

      {showForm && (
        <AddBookForm
          authors={authors}
          onAddBook={handleAddBook}
        />
      )}

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Status</label>
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

        <div className="col-md-4">
          <label className="form-label">Autor</label>
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
        <button className="btn btn-outline-primary mt-3" onClick={handleNextPage}>
          Načíst další
        </button>
      )}

      {selectedBook && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">{selectedBook.name}</h5>

            <p className="card-text">
              <strong>Autor:</strong>{" "}
              {selectedBook.author?.map((a) => a.name).join(", ")}
            </p>

            <p className="card-text">
              <strong>Jazyk:</strong> {selectedBook.language}
            </p>

            <p className="card-text">
              {selectedBook.is_read ? "Přečteno" : "Nepřečteno"}
            </p>

            <button
              className="btn btn-warning"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Upravit
            </button>
          </div>
        </div>
      )}

      {isEditing && selectedBook && (
        <EditBookForm
          book={selectedBook}
          authors={authors}
          onUpdateBook={handleUpdateBook}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export default App;