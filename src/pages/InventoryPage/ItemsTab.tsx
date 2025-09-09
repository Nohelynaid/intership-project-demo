import { Button, Form, InputGroup, Stack, Table } from "react-bootstrap";
import type { Item } from "../../models/Inventory.type";
import { Link } from "react-router-dom";
import { formatDate } from "./InventoryPage";
import { useEffect, useMemo, useState } from "react";
import { getItemsFromInventory } from "../../api/items.api";

export default function ItemsTab({ inventoryId }: { inventoryId: string }) {

    const [items, setItems] = useState<Item[]>([]);
    async function loadItems() {
        const res = await getItemsFromInventory(inventoryId);
        setItems(res)
    }

    useEffect(() => {
        loadItems();
    }, [])


    const [q, setQ] = useState("");
    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return needle
            ? items.filter((it) => `${it.invNumber} ${JSON.stringify(it.data)}`.toLowerCase().includes(needle))
            : items;
    }, [q, items]);

    return (
        <div className="pt-3">
            <Stack direction="horizontal" gap={2} className="mb-3 flex-wrap">
                <InputGroup size="sm" style={{ minWidth: 260 }}>
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control value={q} onChange={(e) => setQ(e.target.value)} placeholder="ID or data…" />
                </InputGroup>
                <div className="ms-auto">
                    <Button size="sm" >+ New item</Button>
                </div>
            </Stack>

            <div className="table-responsive">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="text-body-secondary small">
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((it) => (
                            <tr key={it.id}>
                                <td><Link to={`/inventory/${inventoryId}/items/${it.id}`} className="link-underline link-underline-opacity-0">{it.invNumber}</Link></td>
                                <td className="text-truncate" style={{ maxWidth: 480 }}>{JSON.stringify(it.data)}</td>
                                <td>{formatDate(it.createdAt)}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-4 text-body-secondary">No items</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}