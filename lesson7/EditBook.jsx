import { useState } from "react";

function EditBook({ book, onSave }) {
    const [title, setTitle] = useState(book.title);
    const [rating, setRating] = useState(book.rating ?? 1);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // ולידציה בסיסית בצד לקוח
        if (!title.trim()) {
            setError("חובה להזין כותרת");
            return;
        }

        const res = await fetch(`/api/books/${book._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, rating }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "אירעה שגיאה בעדכון הספר");
            return;
        }

        onSave(data); // מעדכן את הרשימה בקומפוננטת האב
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="שם הספר"
            />
            <input
                type="number"
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                min={1}
                max={5}
            />
            <button type="submit">שמרי שינויים</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}

function BooksPage() {
    const [books, setBooks] = useState([]);
    const [editing, setEditing] = useState(null);

    function handleSave(updatedBook) {
        setBooks(prev =>
            prev.map(b => (b._id === updatedBook._id ? updatedBook : b))
        );
        setEditing(null);
    }

    return (
        <div>
            <ul>
                {books.map(b => (
                    <li key={b._id}>
                        {b.title} (rating: {b.rating ?? "-"})
                        <button onClick={() => setEditing(b)}>ערכי</button>
                    </li>
                ))}
            </ul>

            {editing && (
                <EditBook book={editing} onSave={handleSave} />
            )}
        </div>
    );
}


