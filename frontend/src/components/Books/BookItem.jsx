function BookItem({ book, onSelectBook, onDeleteBook, onToggleRead }) {
  return (
    <div
      className="card mb-3 h-100"
      onClick={() => onSelectBook(book)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <h5 className="card-title">{book.name}</h5>

        {/* 👇 AUTOR */}
        <p className="card-text">
          <strong>Autor:</strong>{" "}
          {book.author?.map((author) => author.name).join(", ")}
        </p>

        <p className="card-text">
          <strong>Jazyk:</strong> {book.language}
        </p>

        <p className="card-text">
          <strong>Status:</strong>{" "}
          {book.is_read ? "Přečteno" : "Nepřečteno"}
        </p>

        <button
          className="btn btn-success me-2"
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead(book);
          }}
        >
          {book.is_read ? "Nepřečteno" : "Přečteno"}
        </button>

        <button
          className="btn btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBook(book.id);
          }}
        >
          🗑️ Smazat
        </button>
      </div>
    </div>
  );
}

export default BookItem;