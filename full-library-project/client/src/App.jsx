import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Books from "./Books";

function HomeRedirect() {
    const token = localStorage.getItem("token");
    return <Navigate to={token ? "/books" : "/login"} />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/books" element={<Books />} />
        </Routes>
    );
}
