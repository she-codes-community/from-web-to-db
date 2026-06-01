import { useEffect, useState } from "react";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import DeleteBook from "./DeleteBook";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

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
        setEditingId(null);
    }

    function handleDelete(deletedId) {
        setBooks(prev => prev.filter(b => b._id !== deletedId));
    }

    if (loading) return <p>טוען ספרים...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const editingBook = books.find(b => b._id === editingId) || null;

    return (
        <div>
            <AddBook onBookAdded={(book) => setBooks((prev) => [book, ...prev])} />
            {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
            <ul>
                {books.map(b => (
                    <li key={b._id}>
                        {b.title} – {b.author ?? "-"} ({b.year ?? "-"}){b.rating != null && <> | rating: {b.rating}</>}
                        <button onClick={() => setEditingId(b._id)}>ערכי</button>
                        <DeleteBook bookId={b._id} onDeleted={() => handleDelete(b._id)} onError={setDeleteError} />
                    </li>
                ))}
            </ul>

            {editingBook && (
                <EditBook book={editingBook} onSave={handleSave} onCancel={() => setEditingId(null)} />
            )}
        </div>
    );
}
