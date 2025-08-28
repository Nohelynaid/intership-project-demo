import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

export type Inventory = {
    id: string;
    name: string;
    description?: string;
    image?: string;
    creator: string;
    tags: string[];
    itemCount: number;
    createdAt: string; // ISO date
};

export type TagCount = { tag: string; count: number };

const MOCK_INVENTORIES: Inventory[] = [
    {
        id: "1",
        name: "Laptops",
        description: "Office notebooks and ultrabooks",
        image: "https://picsum.photos/seed/laptops/80/80",
        creator: "Diana",
        tags: ["office", "hardware", "it"],
        itemCount: 42,
        createdAt: "2025-08-20T10:00:00Z",
    },
    {
        id: "2",
        name: "Monitors",
        description: "LCD/LED monitors for workstations",
        image: "https://picsum.photos/seed/monitors/80/80",
        creator: "Carlos",
        tags: ["office", "hardware"],
        itemCount: 23,
        createdAt: "2025-08-25T08:30:00Z",
    },
    {
        id: "3",
        name: "Library – Programming Books",
        description: "Books on JS, React, Python, and more",
        image: "https://picsum.photos/seed/books/80/80",
        creator: "Ana",
        tags: ["library", "education", "it"],
        itemCount: 128,
        createdAt: "2025-08-10T09:00:00Z",
    },
    {
        id: "4",
        name: "HR Documents",
        description: "Policies, contracts, and onboarding",
        image: "https://picsum.photos/seed/hr/80/80",
        creator: "María",
        tags: ["hr", "documents"],
        itemCount: 11,
        createdAt: "2025-08-27T13:45:00Z",
    },
    {
        id: "5",
        name: "Cameras",
        description: "DSLR and mirrorless for marketing",
        image: "https://picsum.photos/seed/cameras/80/80",
        creator: "Luis",
        tags: ["marketing", "hardware"],
        itemCount: 7,
        createdAt: "2025-08-18T15:20:00Z",
    },
    {
        id: "6",
        name: "Stationery",
        description: "Pens, notebooks, staplers, etc.",
        image: "https://picsum.photos/seed/stationery/80/80",
        creator: "Diana",
        tags: ["office", "supplies"],
        itemCount: 64,
        createdAt: "2025-08-26T17:00:00Z",
    },
];

function InventoryCell({ inv }: { inv: Inventory }) {
    const imgStyle: CSSProperties = { width: 40, height: 40, objectFit: "cover" };
    return (
        <Stack direction="horizontal" gap={3}>
            {inv.image && <Image src={inv.image} alt="" rounded style={imgStyle} />}
            <div>
                <div className="fw-semibold">{inv.name}</div>
                <div className="text-body-secondary small">by {inv.creator}</div>
            </div>
        </Stack>
    );
}

function InventoriesTable({
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
                                <th>Creator</th>
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
                                    <td>{inv.creator}</td>
                                    <td className="text-end">
                                        <Badge bg="secondary">{inv.itemCount}</Badge>
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

function TagCloud({ data, onClick }: { data: TagCount[]; onClick?: (tag: string) => void }) {
    return (
        <Card className="shadow-sm">
            <Card.Header>
                <Card.Title as="h2" className="h6 m-0">
                    Tag cloud
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="d-flex flex-wrap gap-2">
                    {data.map((t) => (
                        <Button
                            key={t.tag}
                            size="sm"
                            variant="outline-secondary"
                            className="rounded-pill"
                            onClick={() => onClick?.(t.tag)}
                        >
                            {t.tag} <Badge bg="secondary" className="ms-2">{t.count}</Badge>
                        </Button>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}

function computeTagCloud(list: Inventory[]): TagCount[] {
    const counts = new Map<string, number>();
    list.forEach((inv) => (inv.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return Array.from(counts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
}

function SearchResults({ tag, inventories }: { tag: string; inventories: Inventory[] }) {
    const filtered = useMemo(() => inventories.filter((i) => i.tags?.includes(tag)), [tag, inventories]);
    return (
        <InventoriesTable title={`Results for tag: ${tag}`} right={`${filtered.length} result(s)`} inventories={filtered} />
    );
}

export default function HomePage() {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Latest inventories (by createdAt desc, limit 6)
    const latest = useMemo<Inventory[]>(
        () =>
            [...MOCK_INVENTORIES]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 6),
        []
    );

    // Top 5 popular by itemCount desc
    const top5 = useMemo<Inventory[]>(
        () => [...MOCK_INVENTORIES].sort((a, b) => b.itemCount - a.itemCount).slice(0, 5),
        []
    );

    const tags = useMemo<TagCount[]>(() => computeTagCloud(MOCK_INVENTORIES), []);

    return (
        <Container fluid className="py-4">
            <Row className="justify-content-center">
                <Col xs={12} xl={10} xxl={9}>
                    <Row className="mb-4 g-3 align-items-center">
                        <Col xs={12} md={8} className="text-center text-md-start">
                            <h1 className="h3 mb-1">Inventory Dashboard</h1>
                            <p className="text-body-secondary mb-0">Latest inventories, most popular, and quick tag filters.</p>
                        </Col>
                        <Col xs={12} md={4} className="text-center text-md-end">
                            {activeTag && (
                                <Button variant="outline-secondary" size="sm" onClick={() => setActiveTag(null)}>
                                    Clear filter
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <Row className="g-4 mt-1">
                        <Col xs={12}>
                            <TagCloud data={tags} onClick={setActiveTag} />
                        </Col>
                    </Row>
                    <br />
                    <Row className="g-4 justify-content-center">
                        {activeTag ? (
                            <Col xs={12} lg={12}>
                                <SearchResults tag={activeTag} inventories={MOCK_INVENTORIES} />
                            </Col>
                        ) : (
                            <Col xs={12} lg={12}>
                                <InventoriesTable title="Latest inventories" right={`${latest.length}`} inventories={latest} />
                            </Col>
                        )}
                        <Col xs={12} lg={12}>
                            <InventoriesTable title="Top 5 popular" right={"Top 5"} inventories={top5} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
