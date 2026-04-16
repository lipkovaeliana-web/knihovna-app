import BookItem from "./BookItem";

function BookList({ books, onSelectBook, onDeleteBook, onToggleRead }) {
  console.log(books);

  return (
    <div className="row">
      {books.map((book) => (
        <div key={book.id} className="col-12 col-md-6 col-xl-4">
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