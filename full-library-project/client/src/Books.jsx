import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import DeleteBook from "./DeleteBook";
import { authHeaders } from "./authHeaders";

const API_BASE = "http://localhost:3000";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadBooks() {
            setPageError(null);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("בעיה בחיבור – התחברי מחדש");
                }

                const res = await fetch("http://localhost:3000/api/books", {
                    headers: authHeaders(),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error || "שגיאה בטעינת ספרים");
                }

                setBooks(data);
            } catch (err) {
                console.error(err);
                setPageError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, []);

    function handleBookAdded(newBook) {
        setBooks((prev) => [newBook, ...prev]);
    }

    function handleBookSaved(updatedBook) {
        setBooks((prev) =>
            prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
        );
        setEditingId(null);
    }

    function handleBookDeleted(deletedId) {
        setBooks((prev) => prev.filter((b) => b.id !== deletedId));
        if (editingId === deletedId) setEditingId(null);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (loading) return <p>טוען ספרים...</p>;
    if (pageError) return <p>{pageError}</p>;

    const editingBook = books.find((b) => b.id === editingId) || null;

    return (
        <div>
            {/* הוספה (כמו שכבר עשיתם) */}
            <AddBook onBookAdded={handleBookAdded} />

            <ul>
                {books.map((b) => (
                    <li key={b.id}>
                        <strong>{b.title}</strong>
                        {b.author && <> – {b.author}</>}
                        {b.year && <> ({b.year})</>}
                        {b.rating != null && <> | rating: {b.rating}</>}

                        <button type="button" onClick={() => setEditingId(b.id)}>
                            ערכי
                        </button>

                        <DeleteBook
                            bookId={b.id}
                            apiBase={API_BASE}
                            onDeleted={() => handleBookDeleted(b.id)}
                            onError={(msg) => setPageError(msg)}
                        />
                    </li>
                ))}
            </ul>

            {/* עריכה */}
            {editingBook && (
                <EditBook
                    key={editingBook.id}
                    book={editingBook}
                    apiBase={API_BASE}
                    onSave={handleBookSaved}
                    onCancel={() => setEditingId(null)}
                />
            )}

            <button onClick={handleLogout}>
                התנתקות
            </button>
        </div>
    );
}
