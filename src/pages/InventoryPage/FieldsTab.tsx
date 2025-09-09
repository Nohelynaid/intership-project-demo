import { Button, Form, Table } from "react-bootstrap";
import type { Field } from "../../models/Inventory.type";
import { useState } from "react";
import { createFields } from "../../api/fields.api";

export default function FieldsTab({ id, data, editable, loadFields }: { data: Field[]; editable: boolean, loadFields: Function, id: string }) {
    const [fields, setFields] = useState<Field[]>(data.map(f => ({ ...f, optionsString: (f.options ?? []).join(",") })));
    const blank: Field = { key: "", name: "", type: "string", required: false, id: "", inventoryId: "", options: [], optionsString: "", position: 0 };

    const update = (i: number, patch: Partial<Field>) => setFields((f) => f.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
    const add = () => setFields((f) => [...f, { ...blank }]);

    const execute = async () => {
        const toCreate = fields.filter(f => f.id === "").map(({ optionsString, id, ...rest }) => rest).map(f => ({ ...f, inventoryId: id }));
        // const toUpdate = fields.filter(f => f.id !== "").map(({ optionsString, id, ...rest }) => rest).map(f => ({ ...f, inventoryId: id }));

        if (toCreate.length > 0) {
            await createFields(toCreate);
        }

        // if (toUpdate.length > 0) {

        // }

        loadFields();
    }


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
                            {/* <th className="text-end">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((f, i) => (
                            <tr key={f.id || i}>
                                <td style={{ minWidth: 160 }}>
                                    <Form.Control size="sm" value={f.key} onChange={(e) => update(i, { key: e.target.value })} />
                                </td>
                                <td style={{ minWidth: 200 }}>
                                    <Form.Control size="sm" value={f.name} onChange={(e) => update(i, { name: e.target.value })} />
                                </td>
                                <td>
                                    <Form.Select size="sm" value={f.type} onChange={(e) => update(i, { type: e.target.value as Field["type"] })}>
                                        <option>string</option>
                                        <option>number</option>
                                        <option>date</option>
                                        <option>boolean</option>
                                        <option>enum</option>
                                    </Form.Select>
                                </td>
                                <td className="text-center">
                                    <Form.Check type="checkbox" checked={!!f.required} onChange={(e) => update(i, { required: e.target.checked })} />
                                </td>
                                <td style={{ minWidth: 220 }}>
                                    {f.type === "enum" ? (
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            placeholder="opt1,opt2"
                                            value={f.optionsString}
                                            onChange={(e) =>
                                                update(i, {
                                                    optionsString: e.target.value,
                                                    options: e.target.value
                                                        .split(",")
                                                        .map((s) => s.trim())
                                                        .filter(Boolean),
                                                })
                                            }
                                        />) : (
                                        <span className="text-body-secondary small">—</span>
                                    )}
                                </td>
                                {/* <td className="text-end">
                                    {editable ? <Button size="sm" variant="outline-danger" onClick={() => remove(i)}>Remove</Button> : <span className="text-body-secondary small">—</span>}
                                </td> */}
                            </tr>
                        ))}
                        {fields.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-4 text-body-secondary">No fields</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {editable && <div className="mt-3 d-flex gap-2"><Button onClick={add}>+ Add field</Button><Button onClick={execute} variant="outline-secondary">Save</Button></div>}
        </div>
    );
}