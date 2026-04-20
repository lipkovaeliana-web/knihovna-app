import BookItem from "./BookItem";


function BookList({ books, onSelectBook, onDeleteBook, onToggleRead }) {
  // Display books data in browser console for debugging
  console.log(books);

  return (
    <div className="row">
      {/* Render all books as cards */}
      {books.map((book) => (
        <div key={book.id} className="col-12 col-md-6 col-xl-4">
          <BookItem
            // Pass single book data to BookItem component
            book={book}

            // Pass functions for detail, delete and read status toggle
            onSelectBook={onSelectBook}
            onDeleteBook={onDeleteBook}
            onToggleRead={onToggleRead}
          />
        </div>
      ))}
    </div>
  );
}

export default BookList;