import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";
import type { CreateInventory, Inventory, Inventory_2 } from "../../models/Inventory.type";
import { createInventory, loadInventoriesFromUser } from "../../api/inventories.api";

export const currentUserId = "886097ca-8824-414e-abb5-b4c5bacbafd1";

export function formatDate(iso: string) {
    try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}

export default function InventoryPage() {

    const [myInventories, setMyInventories] = useState<Inventory[]>([]);

    async function init() {
        const res = await loadInventoriesFromUser(currentUserId);
        setMyInventories(res);
    }

    useEffect(() => {
        init();
    }, [])

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<Inventory_2 | null>(null);
    const [showDelete, setShowDelete] = useState<Inventory_2 | null>(null);

    const [formData, setFormData] = useState<CreateInventory>({
        code: "",
        name: "",
        description: "",
        ownerId: "",
        isPublic: false,
        image: null,
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                e.target instanceof HTMLInputElement && e.target.type === "checkbox"
                    ? e.target.checked
                    : value,
        }));
    };

    const clean = () => {
        setFormData({
            code: "",
            name: "",
            description: "",
            ownerId: "",
            isPublic: false,
            image: null
        });
        setShowCreate(false);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createInventory({ ...formData, ownerId: currentUserId });
        setShowCreate(false);
        await init(); // reload the items
    };

    return (
        <Container className="py-4 w-100">
            <Row className="mb-4 g-3 align-items-center w-100">
                <Col xs={12} md={8}>
                    <h1 className="h3 mb-1">My Inventories</h1>
                    <div className="text-body-secondary">Manage the inventories you own and those you can edit.</div>
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                    <Button onClick={() => setShowCreate(true)}>+ New Inventory</Button>
                </Col>
            </Row>

            <Row className="g-4 w-100">
                <Col xs={12} lg={12}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="d-flex gap-2 align-items-center justify-content-between flex-wrap">
                            <Card.Title as="h2" className="h6 m-0">Owned by me</Card.Title>
                            {/* <Stack direction="horizontal" gap={2} className="flex-wrap">
                                <InputGroup size="sm" style={{ minWidth: 220 }}>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control value={ownedSF.q} onChange={(e) => ownedSF.setQ(e.target.value)} placeholder="Name, code…" />
                                </InputGroup>
                                <Form.Select size="sm" value={ownedSF.sortKey as string} onChange={(e) => ownedSF.setSortKey(e.target.value as keyof Inventory_2)}>
                                    <option value="updatedAt">Sort: Updated</option>
                                    <option value="name">Sort: Name</option>
                                    <option value="itemCount">Sort: Items</option>
                                </Form.Select>
                                <Form.Select size="sm" value={ownedSF.dir} onChange={(e) => ownedSF.setDir(e.target.value as any)}>
                                    <option value="desc">Desc</option>
                                    <option value="asc">Asc</option>
                                </Form.Select>
                            </Stack> */}
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="text-body-secondary small">
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Items</th>
                                            <th>Updated</th>
                                            {/* <th className="text-end">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myInventories.map((inv) => (
                                            <tr key={inv.id}>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Badge bg="secondary">{inv.code}</Badge>
                                                        <Link to={`/inventory/${inv.id}`} className="link-underline link-underline-opacity-0">{inv.name}</Link>
                                                    </Stack>
                                                </td>
                                                <td className="text-truncate" style={{ maxWidth: 320 }}>{inv.description}</td>
                                                <td>{inv._count.items}</td>
                                                <td>{formatDate(inv.updatedAt)}</td>
                                            </tr>
                                        ))}
                                        {myInventories.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center py-4 text-body-secondary">No inventories</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <br />
            {/* <Row className="g-4">
                <Col xs={12} lg={12}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="d-flex gap-2 align-items-center justify-content-between flex-wrap">
                            <Card.Title as="h2" className="h6 m-0">I can edit</Card.Title>
                            <Stack direction="horizontal" gap={2} className="flex-wrap">
                                <InputGroup size="sm" style={{ minWidth: 200 }}>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control value={writeSF.q} onChange={(e) => writeSF.setQ(e.target.value)} placeholder="Name, code…" />
                                </InputGroup>
                                <Form.Select size="sm" value={writeSF.sortKey as string} onChange={(e) => writeSF.setSortKey(e.target.value as keyof Inventory_2)}>
                                    <option value="updatedAt">Updated</option>
                                    <option value="name">Name</option>
                                    <option value="itemCount">Items</option>
                                </Form.Select>
                                <Form.Select size="sm" value={writeSF.dir} onChange={(e) => writeSF.setDir(e.target.value as any)}>
                                    <option value="desc">Desc</option>
                                    <option value="asc">Asc</option>
                                </Form.Select>
                            </Stack>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="text-body-secondary small">
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Items</th>
                                            <th>Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {writeSF.rows.map((inv) => (
                                            <tr key={inv.id}>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Badge bg="secondary">{inv.code}</Badge>
                                                        <Link to={`/inventory/${inv.id}`} className="link-underline link-underline-opacity-0">{inv.name}</Link>
                                                    </Stack>
                                                </td>
                                                <td className="text-truncate" style={{ maxWidth: 220 }}>{inv.description}</td>
                                                <td>{inv.itemCount}</td>
                                                <td>{formatDate(inv.updatedAt)}</td>
                                            </tr>
                                        ))}
                                        {writeSF.rows.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-body-secondary">No inventories</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}

            {/* Create Modal (mock) */}
            <Modal show={showCreate} onHide={clean} centered>
                <Modal.Header closeButton><Modal.Title>New Inventory</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                name="name"
                                placeholder="e.g. Cameras"
                                value={formData.name}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                name="code"
                                placeholder="e.g. CAM"
                                value={formData.code}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name="description"
                                as="textarea" rows={3}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Is Public?</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                label="Yes"
                            ></Form.Check>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={clean}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal (mock) */}
            <Modal show={!!showEdit} onHide={() => setShowEdit(null)} centered>
                <Modal.Header closeButton><Modal.Title>Edit Inventory</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Alert variant="secondary" className="small">This is a mock UI. Wire it to your API.</Alert>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control defaultValue={showEdit?.name} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} defaultValue={showEdit?.description} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowEdit(null)}>Cancel</Button>
                    <Button onClick={() => setShowEdit(null)}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal (mock) */}
            <Modal show={!!showDelete} onHide={() => setShowDelete(null)} centered>
                <Modal.Header closeButton><Modal.Title>Delete inventory</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete <b>{showDelete?.name}</b>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDelete(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => setShowDelete(null)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}





