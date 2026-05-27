import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "שגיאה בהתחברות");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/books");
        } catch (err) {
            console.error(err);
            setMessage("שגיאת רשת");
        }
    }

    return (
        <div>
            <h2>התחברות</h2>

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
                <button type="submit">התחברי</button>
            </form>

            {message && <p style={{ color: "red" }}>{message}</p>}

            <p>
                אין לך משתמשת? <Link to="/signup">הרשמי כאן</Link>
            </p>
        </div>
    );
}
