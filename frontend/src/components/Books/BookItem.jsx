function BookItem({ book }) {
  return (
    <div>
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
