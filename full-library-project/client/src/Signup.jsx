import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "שגיאה בהרשמה");
                return;
            }

            // הרשמה הצליחה → מעבר ללוגין
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("שגיאת רשת");
        }
    }

    return (
        <div>
            <h2>הרשמה</h2>

            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="אימייל"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="סיסמה"
                />
                <button type="submit">הירשמי</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* 👇 חזרה להתחברות */}
            <p>
                כבר רשומה? <Link to="/login">התחברי כאן</Link>
            </p>
        </div>
    );
}
