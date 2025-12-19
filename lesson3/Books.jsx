import { useEffect, useState } from "react";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>טוען ספרים...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <ul>
            {books.map((b) => (
                <li key={b.id}>{b.title}</li>
            ))}
        </ul>
    );
}

