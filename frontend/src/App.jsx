import { useEffect, useState } from "react";
import AddBookForm from "./components/Books/AddBookForm";
import BookList from "./components/Books/BookList";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);

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

  return (
    <div>
      <h1>Moje knihovna</h1>
      <AddBookForm onAddBook={handleAddBook} />
      <BookList books={books} />
    </div>
  );
}

export default App;