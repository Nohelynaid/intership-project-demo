import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";

// =====================
// Types
// =====================
export type Inventory = {
    id: string;
    code: string;
    name: string;
    description?: string;
    image?: string;
    ownerId: string;
    writeUsers: string[]; // user IDs with write access
    tags: string[];
    itemCount: number;
    updatedAt: string; // ISO date
    numberingPattern: string; // e.g. {CODE}-{YYYY}-{SEQ:5}
    isPublic: boolean;
    fields: InvField[];
};

export type InvField = {
    key: string;
    name: string;
    type: "string" | "number" | "date" | "boolean" | "enum";
    required?: boolean;
    options?: string[]; // for enum
};

export type Item = {
    id: string;
    invId: string;
    invNumber: string;
    data: Record<string, unknown>;
    createdAt: string;
};

// =====================
// Mock data
// =====================
const currentUserId = "u_diana";

const MOCK_INVENTORIES: Inventory[] = [
    {
        id: "inv_laptops",
        code: "LAP",
        name: "Laptops",
        description: "Office notebooks and ultrabooks",
        image: "https://picsum.photos/seed/laptops/80/80",
        ownerId: currentUserId,
        writeUsers: [currentUserId, "u_carlos"],
        tags: ["office", "hardware", "it"],
        itemCount: 42,
        updatedAt: "2025-08-27T13:45:00Z",
        numberingPattern: "{CODE}-{YYYY}-{SEQ:5}",
        isPublic: true,
        fields: [
            { key: "model", name: "Model", type: "string", required: true },
            { key: "price", name: "Price", type: "number" },
            { key: "vendor", name: "Vendor", type: "string" },
        ],
    },
    {
        id: "inv_books",
        code: "BOOK",
        name: "Programming Books",
        description: "Library – JS, React, Python and more",
        image: "https://picsum.photos/seed/books/80/80",
        ownerId: "u_ana",
        writeUsers: ["u_ana", currentUserId],
        tags: ["library", "education"],
        itemCount: 128,
        updatedAt: "2025-08-20T10:00:00Z",
        numberingPattern: "{CODE}-{YY}-{SEQ:4}",
        isPublic: false,
        fields: [
            { key: "title", name: "Title", type: "string", required: true },
            { key: "author", name: "Author", type: "string" },
            { key: "year", name: "Year", type: "number" },
        ],
    },
    {
        id: "inv_hr",
        code: "HRD",
        name: "HR Documents",
        description: "Policies, contracts, and onboarding",
        image: "https://picsum.photos/seed/hr/80/80",
        ownerId: currentUserId,
        writeUsers: [currentUserId],
        tags: ["hr", "documents"],
        itemCount: 11,
        updatedAt: "2025-08-25T08:30:00Z",
        numberingPattern: "HR-{YYYY}-{SEQ:3}",
        isPublic: false,
        fields: [
            { key: "docType", name: "Document type", type: "enum", options: ["Policy", "Contract", "Onboarding"], required: true },
        ],
    },
];

const MOCK_ITEMS: Item[] = [
    { id: "i1", invId: "inv_laptops", invNumber: "LAP-2025-00001", data: { model: "XPS 13", price: 28000, vendor: "Dell" }, createdAt: "2025-08-01" },
    { id: "i2", invId: "inv_laptops", invNumber: "LAP-2025-00002", data: { model: "MacBook Air", price: 32000, vendor: "Apple" }, createdAt: "2025-08-02" },
    { id: "i3", invId: "inv_books", invNumber: "BOOK-25-0001", data: { title: "You Don't Know JS", author: "Kyle Simpson", year: 2015 }, createdAt: "2025-08-02" },
];

// =====================
// Utilities
// =====================
function formatDate(iso: string) {
    try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}

function useSortFilter<T>(rows: T[], keys: (keyof T)[], textSelector?: (row: T) => string) {
    const [q, setQ] = useState("");
    const [sortKey, setSortKey] = useState<keyof T>(keys[0]);
    const [dir, setDir] = useState<"asc" | "desc">("desc");

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        const base = needle
            ? rows.filter((r) => (textSelector ? textSelector(r) : JSON.stringify(r)).toLowerCase().includes(needle))
            : rows;
        const sorted = [...base].sort((a: any, b: any) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            if (av === bv) return 0;
            const comp = av > bv ? 1 : -1;
            return dir === "asc" ? comp : -2 * comp + (comp === 1 ? 0 : -comp); // simple invert
        });
        return sorted;
    }, [rows, q, sortKey, dir, textSelector]);

    return { q, setQ, sortKey, setSortKey, dir, setDir, rows: filtered };
}

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <Dropdown as={ButtonGroup} align="end">
            <Button size="sm" variant="outline-secondary">Manage</Button>
            <Dropdown.Toggle split size="sm" variant="outline-secondary" id="inv-split" />
            <Dropdown.Menu>
                <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={onDelete}>Delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}


export default function InventoryPage() {
    const owned = useMemo(() => MOCK_INVENTORIES.filter((i) => i.ownerId === currentUserId), []);
    const write = useMemo(() => MOCK_INVENTORIES.filter((i) => i.writeUsers.includes(currentUserId) && i.ownerId !== currentUserId), []);

    const ownedSF = useSortFilter<Inventory>(owned, ["updatedAt", "name", "itemCount"],
        (r) => `${r.name} ${r.code} ${r.description ?? ""}`
    );
    const writeSF = useSortFilter<Inventory>(write, ["updatedAt", "name", "itemCount"],
        (r) => `${r.name} ${r.code} ${r.description ?? ""}`
    );

    // Create / Edit modals (mock)
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<Inventory | null>(null);
    const [showDelete, setShowDelete] = useState<Inventory | null>(null);

    return (
        <Container className="py-4">
            <Row className="mb-4 g-3 align-items-center">
                <Col xs={12} md={8}>
                    <h1 className="h3 mb-1">My Inventories</h1>
                    <div className="text-body-secondary">Manage the inventories you own and those you can edit.</div>
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                    <Button onClick={() => setShowCreate(true)}>+ New Inventory</Button>
                </Col>
            </Row>

            <Row className="g-4">
                <Col xs={12} lg={7}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="d-flex gap-2 align-items-center justify-content-between flex-wrap">
                            <Card.Title as="h2" className="h6 m-0">Owned by me</Card.Title>
                            <Stack direction="horizontal" gap={2} className="flex-wrap">
                                <InputGroup size="sm" style={{ minWidth: 220 }}>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control value={ownedSF.q} onChange={(e) => ownedSF.setQ(e.target.value)} placeholder="Name, code…" />
                                </InputGroup>
                                <Form.Select size="sm" value={ownedSF.sortKey as string} onChange={(e) => ownedSF.setSortKey(e.target.value as keyof Inventory)}>
                                    <option value="updatedAt">Sort: Updated</option>
                                    <option value="name">Sort: Name</option>
                                    <option value="itemCount">Sort: Items</option>
                                </Form.Select>
                                <Form.Select size="sm" value={ownedSF.dir} onChange={(e) => ownedSF.setDir(e.target.value as any)}>
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
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ownedSF.rows.map((inv) => (
                                            <tr key={inv.id}>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Badge bg="secondary">{inv.code}</Badge>
                                                        <Link to={`/inventory/${inv.id}`} className="link-underline link-underline-opacity-0">{inv.name}</Link>
                                                    </Stack>
                                                </td>
                                                <td className="text-truncate" style={{ maxWidth: 320 }}>{inv.description}</td>
                                                <td>{inv.itemCount}</td>
                                                <td>{formatDate(inv.updatedAt)}</td>
                                                <td className="text-end">
                                                    <ActionMenu onEdit={() => setShowEdit(inv)} onDelete={() => setShowDelete(inv)} />
                                                </td>
                                            </tr>
                                        ))}
                                        {ownedSF.rows.length === 0 && (
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

                <Col xs={12} lg={5}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="d-flex gap-2 align-items-center justify-content-between flex-wrap">
                            <Card.Title as="h2" className="h6 m-0">I can edit</Card.Title>
                            <Stack direction="horizontal" gap={2} className="flex-wrap">
                                <InputGroup size="sm" style={{ minWidth: 200 }}>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control value={writeSF.q} onChange={(e) => writeSF.setQ(e.target.value)} placeholder="Name, code…" />
                                </InputGroup>
                                <Form.Select size="sm" value={writeSF.sortKey as string} onChange={(e) => writeSF.setSortKey(e.target.value as keyof Inventory)}>
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
            </Row>

            {/* Create Modal (mock) */}
            <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
                <Modal.Header closeButton><Modal.Title>New Inventory</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="e.g. Cameras" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control placeholder="e.g. CAM" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
                    <Button onClick={() => setShowCreate(false)}>Create</Button>
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

// =====================
// Inventory Page with Tabs
// =====================
export function InventoryTabs() {
    const { id } = useParams();
    const navigate = useNavigate();
    const inv = useMemo(() => MOCK_INVENTORIES.find((i) => i.id === id)!, [id]);
    const items = useMemo(() => MOCK_ITEMS.filter((x) => x.invId === id), [id]);
    const canEdit = inv.ownerId === currentUserId || inv.writeUsers.includes(currentUserId);

    if (!inv) return <Container className="py-4"><Alert variant="warning">Inventory not found.</Alert></Container>;

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="mb-3" gap={2}>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>← Back</Button>
                <h1 className="h4 m-0">{inv.name}</h1>
                <Badge bg="secondary" className="ms-2">{inv.code}</Badge>
                <div className="ms-auto text-body-secondary small">{inv.isPublic ? "Public" : "Restricted"}</div>
            </Stack>

            <Card className="shadow-sm">
                <Card.Body>
                    <Tabs defaultActiveKey="items" className="flex-wrap">
                        <Tab eventKey="items" title="Items">
                            <ItemsTab inv={inv} items={items} />
                        </Tab>
                        <Tab eventKey="discussion" title="Discussion">
                            <DiscussionTab />
                        </Tab>
                        <Tab eventKey="general" title="General settings">
                            <GeneralSettingsTab inv={inv} editable={canEdit && inv.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="numbering" title="Custom numbers">
                            <NumberingTab inv={inv} editable={canEdit && inv.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="access" title="Access">
                            <AccessTab inv={inv} editable={canEdit && inv.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="fields" title="Fields">
                            <FieldsTab inv={inv} editable={canEdit && inv.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="stats" title="Stats">
                            <StatsTab inv={inv} items={items} />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
}

// ---- Items Tab ----
function ItemsTab({ inv, items }: { inv: Inventory; items: Item[] }) {
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
                                <td><Link to={`/inventory/${inv.id}/items/${it.id}`} className="link-underline link-underline-opacity-0">{it.invNumber}</Link></td>
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

// ---- Discussion Tab (mock) ----
function DiscussionTab() {
    const [messages, setMessages] = useState([
        { id: 1, user: "Diana", text: "Let's standardize the 'vendor' values.", ts: "2025-08-20" },
        { id: 2, user: "Carlos", text: "Agree. Also we should add warranty field.", ts: "2025-08-21" },
    ]);
    const [text, setText] = useState("");
    const send = () => {
        if (text.trim() === "") return;
        setMessages((m) => [...m, { id: m.length + 1, user: "You", text, ts: new Date().toISOString() }]);
        setText("");
    };
    return (
        <div className="pt-3">
            <div className="mb-3">
                {messages.map((m) => (
                    <Card key={m.id} className="mb-2">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <strong>{m.user}</strong>
                                <span className="text-body-secondary small">{formatDate(m.ts)}</span>
                            </div>
                            <div>{m.text}</div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <InputGroup>
                <Form.Control value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" />
                <Button onClick={send}>Send</Button>
            </InputGroup>
        </div>
    );
}

// ---- General Settings Tab ----
function GeneralSettingsTab({ inv, editable }: { inv: Inventory; editable: boolean }) {
    return (
        <Form className="pt-3" onSubmit={(e) => e.preventDefault()}>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control defaultValue={inv.name} disabled={!editable} />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group>
                        <Form.Label>Code</Form.Label>
                        <Form.Control defaultValue={inv.code} disabled={!editable} />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group>
                        <Form.Label>Updated</Form.Label>
                        <Form.Control value={formatDate(inv.updatedAt)} disabled readOnly />
                    </Form.Group>
                </Col>
                <Col xs={12}>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} defaultValue={inv.description} disabled={!editable} />
                    </Form.Group>
                </Col>
            </Row>
            {editable && <div className="mt-3"><Button>Save</Button></div>}
        </Form>
    );
}

// ---- Numbering Tab ----
function NumberingTab({ inv, editable }: { inv: Inventory; editable: boolean }) {
    const [pattern, setPattern] = useState(inv.numberingPattern);
    const preview = renderInventoryNumber(pattern, { code: inv.code, seq: 42 });
    return (
        <div className="pt-3">
            <Form.Group className="mb-2">
                <Form.Label>Pattern</Form.Label>
                <Form.Control value={pattern} disabled={!editable} onChange={(e) => setPattern(e.target.value)} />
                <Form.Text>Placeholders: {"{CODE} {YYYY} {YY} {SEQ:n}"}</Form.Text>
            </Form.Group>
            <Alert variant="secondary" className="small">Preview: <b>{preview}</b></Alert>
            {editable && <Button>Save</Button>}
        </div>
    );
}

function renderInventoryNumber(pattern: string, { code, seq, now = new Date() }: { code: string; seq: number; now?: Date; }) {
    const yyyy = now.getFullYear().toString();
    const yy = yyyy.slice(-2);
    return pattern
        .replace(/\{SEQ:(\d+)\}/g, (_, n) => String(seq).padStart(Number(n), "0"))
        .replace(/\{CODE\}/g, code)
        .replace(/\{YYYY\}/g, yyyy)
        .replace(/\{YY\}/g, yy);
}

// ---- Access Tab ----
function AccessTab({ inv, editable }: { inv: Inventory; editable: boolean }) {
    const [isPublic, setIsPublic] = useState(inv.isPublic);
    const [users, setUsers] = useState(inv.writeUsers.join(", "));
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
                    <Form.Control value={users} onChange={(e) => setUsers(e.target.value)} disabled={!editable} />
                </Form.Group>
            )}
            {editable && <div className="mt-3"><Button>Save</Button></div>}
        </div>
    );
}

// ---- Fields Tab ----
function FieldsTab({ inv, editable }: { inv: Inventory; editable: boolean }) {
    const [fields, setFields] = useState<InvField[]>(inv.fields);
    const blank: InvField = { key: "", name: "", type: "string", required: false };

    const update = (i: number, patch: Partial<InvField>) => setFields((f) => f.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
    const add = () => setFields((f) => [...f, { ...blank }]);
    const remove = (i: number) => setFields((f) => f.filter((_, idx) => idx !== i));

    return (
        <div className="pt-3">
            <div className="table-responsive">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="text-body-secondary small">
                        <tr>
                            <th>Key</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Options</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((f, i) => (
                            <tr key={`${f.key}_${i}`}>
                                <td style={{ minWidth: 160 }}>
                                    <Form.Control size="sm" value={f.key} disabled={!editable} onChange={(e) => update(i, { key: e.target.value })} />
                                </td>
                                <td style={{ minWidth: 200 }}>
                                    <Form.Control size="sm" value={f.name} disabled={!editable} onChange={(e) => update(i, { name: e.target.value })} />
                                </td>
                                <td>
                                    <Form.Select size="sm" value={f.type} disabled={!editable} onChange={(e) => update(i, { type: e.target.value as InvField["type"] })}>
                                        <option>string</option>
                                        <option>number</option>
                                        <option>date</option>
                                        <option>boolean</option>
                                        <option>enum</option>
                                    </Form.Select>
                                </td>
                                <td className="text-center">
                                    <Form.Check type="checkbox" checked={!!f.required} disabled={!editable} onChange={(e) => update(i, { required: e.target.checked })} />
                                </td>
                                <td style={{ minWidth: 220 }}>
                                    {f.type === "enum" ? (
                                        <Form.Control size="sm" placeholder="opt1, opt2" value={(f.options ?? []).join(", ")} disabled={!editable} onChange={(e) => update(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                                    ) : (
                                        <span className="text-body-secondary small">—</span>
                                    )}
                                </td>
                                <td className="text-end">
                                    {editable ? <Button size="sm" variant="outline-danger" onClick={() => remove(i)}>Remove</Button> : <span className="text-body-secondary small">—</span>}
                                </td>
                            </tr>
                        ))}
                        {fields.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-4 text-body-secondary">No fields</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {editable && <div className="mt-3 d-flex gap-2"><Button onClick={add}>+ Add field</Button><Button variant="outline-secondary">Save</Button></div>}
        </div>
    );
}

// ---- Stats Tab (read-only) ----
function StatsTab({ inv, items }: { inv: Inventory; items: Item[] }) {
    const numericKeys = inv.fields.filter((f) => f.type === "number").map((f) => f.key);
    const stringKeys = inv.fields.filter((f) => f.type === "string").map((f) => f.key);

    const stats = useMemo(() => {
        const s: Record<string, any> = { count: items.length, numbers: {}, strings: {} };
        for (const k of numericKeys) {
            const vals = items.map((it) => Number((it.data as any)[k])).filter((v) => !isNaN(v));
            if (vals.length) {
                const sum = vals.reduce((a, b) => a + b, 0);
                s.numbers[k] = { min: Math.min(...vals), max: Math.max(...vals), avg: sum / vals.length };
            }
        }
        for (const k of stringKeys) {
            const freq = new Map<string, number>();
            items.forEach((it) => {
                const v = String((it.data as any)[k] ?? "").trim();
                if (!v) return; freq.set(v, (freq.get(v) || 0) + 1);
            });
            s.strings[k] = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
        }
        return s;
    }, [items, numericKeys.join("|"), stringKeys.join("|")]);

    return (
        <div className="pt-3">
            <Row className="g-3">
                <Col xs={12} md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="text-body-secondary small">Total items</div>
                            <div className="display-6">{stats.count}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={8}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="h6 m-0">Numeric fields (avg/min/max)</Card.Header>
                        <Card.Body>
                            {Object.keys(stats.numbers).length === 0 && <div className="text-body-secondary">No numeric data</div>}
                            {Object.entries(stats.numbers).map(([k, v]: any) => (
                                <div key={k} className="d-flex justify-content-between border-bottom py-2">
                                    <strong>{k}</strong>
                                    <span className="text-body-secondary">avg {v.avg.toFixed(2)} • min {v.min} • max {v.max}</span>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="h6 m-0">Top string values</Card.Header>
                        <Card.Body>
                            {Object.keys(stats.strings).length === 0 && <div className="text-body-secondary">No string data</div>}
                            <Row className="g-3">
                                {Object.entries(stats.strings).map(([k, list]: any) => (
                                    <Col xs={12} md={6} lg={4} key={k}>
                                        <Card>
                                            <Card.Header className="py-2"><strong>{k}</strong></Card.Header>
                                            <Card.Body>
                                                {list.length === 0 && <div className="text-body-secondary small">—</div>}
                                                {list.map(([val, c]: any, idx: number) => (
                                                    <div key={idx} className="d-flex justify-content-between py-1">
                                                        <span className="text-truncate" style={{ maxWidth: 220 }}>{val}</span>
                                                        <Badge bg="secondary">{c}</Badge>
                                                    </div>
                                                ))}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Alert variant="secondary" className="mt-3 small">This tab is read-only for owners (no edits here).</Alert>
        </div>
    );
}
