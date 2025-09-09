import { useState } from "react";
import type { Inventory, Numbering } from "../../models/Inventory.type";
import { Alert, Button, Form } from "react-bootstrap";

function renderInventoryNumber(pattern: string, { code, seq, now = new Date() }: { code: string; seq: number; now?: Date; }) {
    const yyyy = now.getFullYear().toString();
    const yy = yyyy.slice(-2);
    return pattern
        .replace(/\{SEQ:(\d+)\}/g, (_, n) => String(seq).padStart(Number(n), "0"))
        .replace(/\{CODE\}/g, code)
        .replace(/\{YYYY\}/g, yyyy)
        .replace(/\{YY\}/g, yy);
}

export default function NumberingTab({ inv, numbering, editable }: { inv: Inventory; numbering: Numbering; editable: boolean }) {
    const [pattern, setPattern] = useState(numbering.pattern);
    const preview = renderInventoryNumber(pattern || "", { code: inv.code, seq: 42 });
    return (
        <div className="pt-3">
            <Form.Group className="mb-2">
                <Form.Label>Pattern</Form.Label>
                <Form.Control value={pattern} disabled={!editable} onChange={(e) => setPattern(e.target.value)} />
            </Form.Group>
            <Alert variant="secondary" className="small">Preview: <b>{preview}</b></Alert>
            {editable && <Button>Save</Button>}
        </div>
    );
}
