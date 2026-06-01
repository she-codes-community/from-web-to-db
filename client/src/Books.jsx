import { useEffect, useState } from "react";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import DeleteBook from "./DeleteBook";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        async function loadBooks() {
            try {
                setError(null);

                const res = await fetch("http://localhost:3000/api/books");
                if (!res.ok) {
                    throw new Error("Server error: " + res.status);
                }
                const data = await res.json();
                setBooks(data);
            } catch (err) {
                console.error("Error loading books:", err);
                setError("לא הצלחנו לטעון ספרים. נסו שוב מאוחר יותר.");
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, []);

    function handleSave(updatedBook) {
        setBooks(prev =>
            prev.map(b => (b._id === updatedBook._id ? updatedBook : b))
        );
        setEditing(null);
    }

    function handleDelete(deletedId) {
        setBooks(prev => prev.filter(b => b._id !== deletedId));
    }

    if (loading) return <p>טוען ספרים...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
    <div>
      <AddBook onBookAdded={(book) => setBooks((prev) => [book, ...prev])} />
      <ul>
        {books.map(b => (
          <li key={b._id}>
            {b.title} (rating: {b.rating ?? "-"})
            <button onClick={() => setEditing(b)}>ערכי</button>
            <DeleteBook bookId={b._id} onDeleted={() => handleDelete(b._id)} />
          </li>
        ))}
      </ul>

      {editing && (
        <EditBook book={editing} onSave={handleSave} />
      )}
    </div>
  );
}

