import { Button, Col, Form, Row } from "react-bootstrap";
import type { Inventory } from "../../models/Inventory.type";
import { formatDate } from "./InventoryPage";

export default function GeneralSettingsTab({ inv, editable }: { inv: Inventory; editable: boolean }) {
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