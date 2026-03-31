import BookItem from "./BookItem";

function BookList({ books }) {
  console.log(books);

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;