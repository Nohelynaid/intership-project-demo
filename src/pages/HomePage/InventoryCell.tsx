import type { Inventory } from "../../models/Inventory.type";
import { Stack } from "react-bootstrap";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

function stringToColor(string: string): string {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: name.charAt(0).toUpperCase(),
    };
}

export default function InventoryCell({ inv }: { inv: Inventory }) {
    return (
        <Stack direction="horizontal" gap={3}>
            <div className="d-flex align-items-center">
                <Avatar className="me-3" {...stringAvatar(inv.name)}>{inv.name.charAt(0)}</Avatar>
                <div>
                    <Link to={`/inventory/${inv.id}`} className="text-decoration-none">
                        {inv.name}
                    </Link>
                    <div className="text-body-secondary small">
                        by {inv.owner?.name}
                    </div>
                </div>
            </div>
        </Stack>
    );
}