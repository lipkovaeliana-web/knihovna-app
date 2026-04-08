import BookItem from "./BookItem";

function BookList({ books, onSelectBook }) {
  console.log(books);


  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} book={book} onSelectBook={onSelectBook} />

      ))}
    </div>
  );
}

export default BookList;