import { useState } from "react";

export default function AddBook({ onBookAdded }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState("");
    const [saving, setSaving] = useState(false);

    async function addBook(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("http://localhost:3000/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, year: year ? Number(year) : undefined }),
            });

            const data = await res.json();
            setTitle("");
            setAuthor("");
            setYear("");
            onBookAdded(data);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={addBook}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="שם הספר"
            />
            <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="מחברת / מחבר"
            />
            <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="שנת פרסום"
            />
            <button type="submit" disabled={saving}>{saving ? "שומרת..." : "הוסיפי ספר"}</button>
        </form>
    );
}
