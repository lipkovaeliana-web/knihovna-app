import { useEffect, useState } from "react";
import AddBookForm from "./components/Books/AddBookForm";
import BookList from "./components/Books/BookList";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch("http://localhost:8000/api/books/");
      const data = await response.json();
      console.log(data);
      setBooks(data.results);
    }

    fetchBooks();
  }, []);
  const handleAddBook = (book) => {
    setBooks([...books, book]); 
  };
  
  useState

  const handleNextPage = async () => {
    if (!nextPage) return;

    const response = await fetch(nextPage);
    const data = await response.json();
    setBooks(data.results);
    setNextPage(data.next);
  };

  const handleSelectedBook = (book) => {
    setSelectedBook(book);
  };

  return (
    <div>
      <h1>Moje knihovna</h1>
      <AddBookForm onAddBook={handleAddBook} />
      <BookList books={books} />
      {nextPage && <button onClick={handleNextPage}>Načíst další</button>}
      <BookList books={books} onSelectBook={handleSelectedBook} />
      {selectedBook && (
        <div>
          <h2>Detail knihy</h2>
          <p>Název: {selectedBook.name}</p>
          <p>Autor: {selectedBook.author}</p>
          <p>Jazyk: {selectedBook.language}</p>
          <p>Přečteno: {selectedBook.is_read ? "Přečteno" : "Nepřečteno"}</p>
        </div>
      )}  
    </div>
  );
}

export default App;