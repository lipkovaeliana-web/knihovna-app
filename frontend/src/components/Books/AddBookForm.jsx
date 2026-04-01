import { useState } from "react";

function AddBookForm({ onAddBook }) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [isRead, setIsRead] = useState(false);

  const handleAddBook = (event) => {
    event.preventDefault();

    onAddBook({
      name,
      author,
      language,
      is_read: isRead,
    });

    setName("");
    setAuthor("");
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
        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
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