import { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { formatDate } from "./InventoryPage";

export default function DiscussionTab() {
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