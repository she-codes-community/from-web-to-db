import axios from "axios";
import { useEffect, useState } from "react";

export default function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/books")
            .then((res) => setBooks(res.data))
            .catch(() => setError("שגיאה בטעינת ספרים"));
    }, []);

    return (
        <ul>
            {books.map((b) => (
                <li key={b.id}>{b.title}</li>
            ))}
        </ul>
    );
}

