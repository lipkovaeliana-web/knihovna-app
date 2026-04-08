import { useState } from "react";

function AddBookForm({ onAddBook, authors }) {
  const [name, setName] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [language, setLanguage] = useState("");
  const [isRead, setIsRead] = useState(false);

  const handleAddBook = (event) => {
    event.preventDefault();

    if (!name || !authorId) {
      alert("Vyplňte název knihy a vyberte autora.");
      return;
    }

    onAddBook({
      name,
      author_ids: [Number(authorId)],
      language,
      is_read: isRead,
    });

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
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="text"
          placeholder="Jazyk"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
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
    </form>
  );
}

export default AddBookForm;