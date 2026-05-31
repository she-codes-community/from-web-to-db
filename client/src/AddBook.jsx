import { useState } from "react";
import { authHeaders } from "./authHeaders";

export default function AddBook() {
    const [title, setTitle] = useState("");

    async function addBook(e) {
        e.preventDefault();

        const res = await fetch("http://localhost:3000/api/books", {
            method: "POST",
            headers: { ...authHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        const data = await res.json();
        // setBooks((prev) => [data, ...prev]);
        console.log("Book added - reload to view it"); 
        setTitle("");
    }

    return (
        <form onSubmit={addBook}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="שם הספר"
            />
            <button type="submit">הוסיפי ספר</button>
        </form>
    );
}

