import BookItem from "./BookItem";

function BookList({ books, onSelectBook, onDeleteBook }) {
  console.log(books);


  return (
    <div>
      {books.map((book) => (
        <BookItem 
        key={book.id} 
        book={book} 
        onSelectBook={onSelectBook}
        onDeleteBook={onDeleteBook}
        />

      ))}
    </div>
  );
}

export default BookList;