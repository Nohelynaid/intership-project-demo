import { Badge, Card, Table } from "react-bootstrap";
import type { Inventory } from "../../models/Inventory.type";
import InventoryCell from "./InventoryCell";

export default function InventoriesTable({
    title,
    inventories,
    right,
}: {
    title: string;
    inventories: Inventory[];
    right?: string;
}) {
    return (
        <Card className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title as="h2" className="h6 m-0">
                    {title}
                </Card.Title>
                <div className="text-body-secondary small">{right}</div>
            </Card.Header>
            <Card.Body className="p-0">
                <div className="table-responsive">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="text-body-secondary small">
                            <tr>
                                <th>Inventory</th>
                                <th>Description</th>
                                <th className="text-end">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-body-secondary">
                                        No data
                                    </td>
                                </tr>
                            )}
                            {inventories.map((inv) => (
                                <tr key={inv.id}>
                                    <td>
                                        <InventoryCell inv={inv} />
                                    </td>
                                    <td className="text-truncate" style={{ maxWidth: 320 }}>
                                        {inv.description}
                                    </td>
                                    <td className="text-end">
                                        <Badge bg="secondary">{inv._count?.items}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
}