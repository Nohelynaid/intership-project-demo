import { useState } from "react";
import type { Inventory } from "../../models/Inventory.type";
import { Button, Form } from "react-bootstrap";

export default function AccessTab({ inv, editable, users }: { inv: Inventory; editable: boolean, users: { user: { name: string, id: string } }[] }) {
    const [isPublic, setIsPublic] = useState(inv.isPublic);

    // check this to assign by id
    const [usersList, setUsersList] = useState(users.map(u => u.user.name).join(", "));

    return (
        <div className="pt-3">
            <Form.Check
                type="radio"
                label="All authenticated users (public)"
                name="accessMode"
                checked={isPublic}
                disabled={!editable}
                onChange={() => setIsPublic(true)}
            />
            <Form.Check
                className="mt-2"
                type="radio"
                label="Specific users (non-public)"
                name="accessMode"
                checked={!isPublic}
                disabled={!editable}
                onChange={() => setIsPublic(false)}
            />
            {!isPublic && (
                <Form.Group className="mt-3">
                    <Form.Label>Write access users (comma-separated user IDs)</Form.Label>
                    <Form.Control value={usersList} onChange={(e) => setUsersList(e.target.value)} disabled={!editable} />
                </Form.Group>
            )}
            {editable && <div className="mt-3"><Button>Save</Button></div>}
        </div>
    );
}
