import { useEffect, useState } from "react";
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

  return (
    <div>
      <h1>Moje knihovna</h1>
      <BookList books={books} />
    </div>
  );
}

export default App;