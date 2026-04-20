function BookItem({ book, onSelectBook, onDeleteBook, onToggleRead }) {
  return (
    <div
      className="card h-100 shadow-sm"

      // Open book detail when clicking on the card
      onClick={() => onSelectBook(book)}

      style={{ cursor: "pointer" }}
    >
      <div className="card-body d-flex flex-column">
        {/* Book title */}
        <h5 className="card-title">{book.name}</h5>

        {/* Display all authors */}
        <p className="card-text">
          <strong>Autor:</strong>{" "}
          {book.author?.map((author) => author.name).join(", ")}
        </p>

        {/* Book language */}
        <p className="card-text">
          <strong>Jazyk:</strong> {book.language}
        </p>

        {/* Read / unread status */}
        <p className="card-text">
          <strong>Status:</strong>{" "}
          {book.is_read ? (
            <span className="badge bg-success">Přečteno</span>
          ) : (
            <span className="badge bg-secondary">Nepřečteno</span>
          )}
        </p>

        <div className="mt-auto d-flex gap-2">
          {/* Open book detail button */}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectBook(book);
            }}
          >
            Detail
          </button>

          {/* Toggle read/unread status */}
          <button
            className="btn btn-outline-success btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRead(book);
            }}
          >
            {book.is_read ? "Nepřečteno" : "Přečteno"}
          </button>

          {/* Delete selected book */}
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBook(book.id);
            }}
          >
            🗑️ Smazat
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookItem;