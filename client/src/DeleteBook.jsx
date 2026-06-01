import { useState } from "react";

export default function DeleteBook({ bookId, onDeleted, onError }) {
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!window.confirm("בטוחה שתרצי למחוק את הספר?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                onError?.(data?.error || "מחיקה נכשלה");
                return;
            }

            onDeleted();
        } catch (err) {
            console.error(err);
            onError?.("אירעה שגיאת רשת במחיקה");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <button type="button" onClick={handleDelete} disabled={deleting}>
            {deleting ? "מוחקת..." : "מחקי"}
        </button>
    );
}
