import { useState } from "react";

export default function EditBook({ book, onSave, onCancel, apiBase }) {
    const [title, setTitle] = useState(book.title ?? "");
    const [author, setAuthor] = useState(book.author ?? "");
    const [year, setYear] = useState(book.year ?? ""); // string בשביל input
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("חובה להזין שם ספר");
            return;
        }

        // year: אם ריק -> לא שולחות אותו, אם קיים -> ממירות למספר
        const yearNumber = year === "" ? undefined : Number(year);
        if (year !== "" && Number.isNaN(yearNumber)) {
            setError("שנת פרסום חייבת להיות מספר");
            return;
        }

        const payload = {
            title: title.trim(),
            author: author.trim(),
            ...(yearNumber !== undefined ? { year: yearNumber } : {}),
        };

        setSaving(true);
        try {
            const res = await fetch(`${apiBase}/api/books/${book._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || "אירעה שגיאה בעדכון הספר");
                return;
            }

            onSave(data); // מחזיר ספר מעודכן לאבא
        } catch (err) {
            console.error(err);
            setError("אירעה שגיאת רשת");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <h3>עריכת ספר</h3>

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

            <button type="submit" disabled={saving}>
                {saving ? "שומרת..." : "שמרי שינויים"}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                style={{ marginInlineStart: 8 }}
            >
                ביטול
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
