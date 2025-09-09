import { Button, Card } from "react-bootstrap";

export default function TagCloud({ data, onClick }: { data: string[]; onClick?: (tag: string) => void }) {
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
                            key={t}
                            size="sm"
                            variant="outline-secondary"
                            className="rounded-pill"
                            onClick={() => onClick?.(t)}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}