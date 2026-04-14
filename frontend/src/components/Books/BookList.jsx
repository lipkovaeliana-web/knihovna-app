import BookItem from "./BookItem";

function BookList({ books, onSelectBook, onDeleteBook, onToggleRead }) {
  console.log(books);

  return (
    <div className="row mt-4">
      {books.map((book) => (
        <div key={book.id} className="col-md-6 col-lg-4">
          <BookItem 
            book={book} 
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