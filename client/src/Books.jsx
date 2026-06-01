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
    const [editing, setEditing] = useState(null);

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
        setEditing(null);
    }

    function handleDelete(deletedId) {
        setBooks(prev => prev.filter(b => b._id !== deletedId));
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (loading) return <p>טוען ספרים...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <AddBook onBookAdded={(book) => setBooks((prev) => [book, ...prev])} />
            <ul>
                {books.map(b => (
                    <li key={b.id}>
                        {b.title} (rating: {b.rating ?? "-"})
                        <button onClick={() => setEditing(b)}>ערכי</button>
                        <DeleteBook bookId={b._id} onDeleted={() => handleDelete(b._id)} />
                    </li>
                ))}
            </ul>

            {editing && (
                <EditBook book={editing} onSave={handleSave} />
            )}

            <button onClick={handleLogout}>התנתקות</button>
        </div>
    );
}
