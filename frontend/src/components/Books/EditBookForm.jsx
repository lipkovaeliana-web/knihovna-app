import { useState } from "react";

function EditBookForm({ book, authors, onUpdateBook, onCancel }) {
  const [name, setName] = useState(book.name);
  const [language, setLanguage] = useState(book.language);
  const [isRead, setIsRead] = useState(book.is_read);
  const [authorId, setAuthorId] = useState(book.author?.[0]?.id || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdateBook({
      id: book.id,
      name,
      language,
      is_read: isRead,
      author_ids: authorId ? [Number(authorId)] : [],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Upravit knihu</h3>

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>

      <div>
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="">Vyber autora</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
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

      <button type="submit">💾 Uložit změny</button>
      <button type="button" onClick={onCancel}>
        Zrušit
      </button>
    </form>
  );
}

export default EditBookForm;