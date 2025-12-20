import { useState } from "react";
import { authHeaders } from "./authHeaders";

export default function DeleteBook({ bookId, onDeleted, onError, apiBase }) {
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        const ok = window.confirm("בטוחה שתרצי למחוק את הספר?");
        if (!ok) return;

        setDeleting(true);
        try {
            const res = await fetch(`${apiBase}/api/books/${bookId}`, {
                method: "DELETE",
                headers: authHeaders(),
            });

            // אם 204 אין מה לקרוא
            let data = null;
            if (res.status !== 204) {
                data = await res.json().catch(() => null);
            }

            if (!res.ok) {
                const msg = data?.error || "מחיקה נכשלה";
                onError?.(msg);
                return;
            }

            onDeleted?.();
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
