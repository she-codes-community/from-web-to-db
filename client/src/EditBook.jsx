import { useState } from "react";
import { authHeaders } from "./authHeaders";

export default function EditBook({ book, onSave }) {
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

        const res = await fetch(`http://localhost:3000/api/books/${book._id}`, {
            method: "PUT",
            headers: { ...authHeaders(), "Content-Type": "application/json" },
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

