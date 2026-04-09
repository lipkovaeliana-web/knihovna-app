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

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch("http://localhost:8000/api/books/");
      const data = await response.json();
      console.log(data);
      setBooks(data.results);
      setNextPage(data.next);
    }

    fetchBooks();
  }, []);

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

  return (
    <div>
      <h1>Moje knihovna</h1>

      <button onClick={() => setShowForm(!showForm)}>
        ➕ Přidat knihu
      </button>

      {showForm && (
        <AddBookForm
          authors={authors}
          onAddBook={handleAddBook}
        />
      )}

      <BookList
        books={books}
        onSelectBook={handleSelectBook}
        onDeleteBook={handleDeleteBook}
      />

      {nextPage && <button onClick={handleNextPage}>Načíst další</button>}

      {selectedBook && (
        <div>
          <h2>Detail knihy</h2>
          <p>Název: {selectedBook.name}</p>
          <p>
            Autor: {selectedBook.author?.map((author) => author.name).join(", ")}
          </p>
          <p>Jazyk: {selectedBook.language}</p>
          <p>{selectedBook.is_read ? "Přečteno" : "Nepřečteno"}</p>

          <button onClick={() => setIsEditing(true)}>
            ✏️ Upravit
          </button>
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