import { useState } from "react";

function AddBookForm({ onAddBook, authors }) {
  // Form state for book title
  const [name, setName] = useState("");

  // Selected author ID
  const [authorId, setAuthorId] = useState("");

  // Selected book language
  const [language, setLanguage] = useState("");

  // Read / unread status
  const [isRead, setIsRead] = useState(false);

  const handleAddBook = (event) => {
    // Prevent page reload after form submit
    event.preventDefault();

    // Validate required fields
    if (!name || !authorId || !language) {
      alert("Vyplňte všechna požadovaná pole.");
      return;
    }

    // Send new book data to parent component
    onAddBook({
      name,
      author_ids: [Number(authorId)],
      language,
      is_read: isRead,
    });

    // Reset form fields after submit
    setName("");
    setAuthorId("");
    setLanguage("");
    setIsRead(false);
  };

  return (
    <form onSubmit={handleAddBook}>
      <div>
        <input
          type="text"
          placeholder="Název knihy"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="">Vyberte autora</option>
          {/* Display available authors in dropdown */}
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

     <div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Select language</option>
          <option value="cs">Čeština</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isRead}
            onChange={(e) => setIsRead(e.target.checked)}
          />
          Přečteno
        </label>
      </div>

      <button type="submit">Přidat knihu</button>
      <button type="button" onClick={onCancel}>
        Zrušit
      </button>
    </form>
  );
}

export default AddBookForm;