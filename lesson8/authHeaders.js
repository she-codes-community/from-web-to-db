
export function authHeaders(extraHeaders = {}) {
    const token = localStorage.getItem("token");

    if (!token) { throw new Error("Missing token");}

    // authorization and other headers
    return {
        Authorization: `Bearer ${token}`,
        ...extraHeaders,
    };
}

