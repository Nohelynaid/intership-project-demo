import { useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    name: string;
}

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            try {
                const res = await fetch("http://localhost:3000/api/users");
                if (!res.ok) throw new Error("Error al cargar usuarios");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <ul>
            {users.map((u: User) => (
                <li key={u.id}>
                    {u.email} ({u.name})
                </li>
            ))}
        </ul>
    );
}
