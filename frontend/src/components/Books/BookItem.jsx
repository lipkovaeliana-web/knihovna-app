function BookItem({ book, onSelectBook, onDeleteBook, onToggleRead }) {
  return (
    <div
      className="card h-100 shadow-sm"
      onClick={() => onSelectBook(book)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.name}</h5>

        <p className="card-text">
          <strong>Autor:</strong>{" "}
          {book.author?.map((author) => author.name).join(", ")}
        </p>

        <p className="card-text">
          <strong>Jazyk:</strong> {book.language}
        </p>

        <p className="card-text">
          <strong>Status:</strong>{" "}
          {book.is_read ? (
            <span className="badge bg-success">Přečteno</span>
          ) : (
            <span className="badge bg-secondary">Nepřečteno</span>
          )}
        </p>

        <div className="mt-auto d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectBook(book);
            }}
          >
            Detail
          </button>

          <button
            className="btn btn-outline-success btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRead(book);
            }}
          >
            {book.is_read ? "Nepřečteno" : "Přečteno"}
          </button>

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