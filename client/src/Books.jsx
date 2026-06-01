import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import DeleteBook from "./DeleteBook";
import { authHeaders } from "./authHeaders";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadBooks() {
            try {
                setError(null);

                const res = await fetch("http://localhost:3000/api/books", {
                    headers: authHeaders(),
                });
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
            prev.map(b => (b.id === updatedBook.id ? updatedBook : b))
        );
        setEditingId(null);
    }

    function handleDelete(deletedId) {
        setBooks(prev => prev.filter(b => b.id !== deletedId));
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (loading) return <p>טוען ספרים...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const editingBook = books.find(b => b.id === editingId) || null;

    return (
        <div>
            <AddBook onBookAdded={(book) => setBooks((prev) => [book, ...prev])} />
            {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
            <ul>
                {books.map(b => (
                    <li key={b.id}>
                        <button onClick={() => setEditingId(b.id)}>ערכי</button>
                        <DeleteBook bookId={b.id} onDeleted={() => handleDelete(b.id)} onError={setDeleteError} />
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

            <button onClick={handleLogout}>התנתקות</button>
        </div>
    );
}
