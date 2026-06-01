import { useState } from "react";
import { authHeaders } from "./authHeaders";

export default function AddBook({ onBookAdded }) {
    const [title, setTitle] = useState("");
    const [error, setError] = useState(null);

    async function addBook(e) {
        e.preventDefault();
        setError(null);

        const res = await fetch("http://localhost:3000/api/books", {
            method: "POST",
            headers: { ...authHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "הוספת הספר נכשלה");
            return;
        }

        setTitle("");
        onBookAdded(data);
    }

    return (
        <form onSubmit={addBook}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="שם הספר"
            />
            <button type="submit">הוסיפי ספר</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}

