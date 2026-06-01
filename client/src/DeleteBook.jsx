import { useState } from "react";
import { authHeaders } from "./authHeaders";

export default function DeleteBook({ bookId, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    async function handleDelete() {
        if (!window.confirm("בטוחה שתרצי למחוק את הספר?")) return;

        setDeleting(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                method: "DELETE",
                headers: authHeaders(),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setError(data?.error || "מחיקה נכשלה");
                return;
            }

            onDeleted();
        } catch (err) {
            console.error(err);
            setError("אירעה שגיאת רשת במחיקה");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <button type="button" onClick={handleDelete} disabled={deleting}>
                {deleting ? "מוחקת..." : "מחקי"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
}
