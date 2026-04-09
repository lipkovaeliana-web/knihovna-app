function BookItem({ book, onSelectBook, onDeleteBook }) {

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
      <button
        style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
        onClick={(e) => {
        e.stopPropagation();
        onDeleteBook(book.id);
      }}
      >
        🗑️ Smazat
      </button>
    </div>
  );
}

export default BookItem;
