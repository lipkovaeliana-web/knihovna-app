import {useEffect, useState } from "react";
import BookList from "./components/Books/BookList";
import './App.css'

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    }

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Moje knihivna</h1>
      <BookList books={books} />
    </div>
  );
}         

export default App;
