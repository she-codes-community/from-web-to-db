export function authHeaders(extraHeaders = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Missing token");
    }

    return {
        Authorization: `Bearer ${token}`,
        ...extraHeaders,
    };
}
