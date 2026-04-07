function BookItem({ book, onSelectBook }) {

  return (
    <div 
      onClick={() => onSelectBook(book)}
      style={{ cursor: "pointer" }}

      >
      <h2>{book.name}</h2>

      <p>
        <strong>Jazyk:</strong> {book.language}
      </p>

      <p>
        <strong>Status:</strong> {book.is_read ? "Přečteno" : "Nepřečteno"}
      </p>
    </div>
  );
}

export default BookItem;
