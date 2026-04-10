import BookItem from "./BookItem";

function BookList({ books, onSelectBook, onDeleteBook, onToggleRead }) {
  console.log(books);


  return (
    <div>
      {books.map((book) => (
        <BookItem 
        key={book.id} 
        book={book} 
        onSelectBook={onSelectBook}
        onDeleteBook={onDeleteBook}
        onToggleRead={onToggleRead}
        />

      ))}
    </div>
  );
}

export default BookList;