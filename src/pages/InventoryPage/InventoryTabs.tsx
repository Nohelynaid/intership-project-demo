import { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Stack, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { type Field, type Inventory, type Numbering } from "../../models/Inventory.type";
import { currentUserId } from "./InventoryPage";
import ItemsTab from "./ItemsTab";
import { getInventory } from "../../api/inventories.api";
import DiscussionTab from "./DiscussionTab";
import GeneralSettingsTab from "./GeneralSettingsTab";
import { getNumberingFromInventory } from "../../api/numbering.api";
import NumberingTab from "./NumberingTab";
import AccessTab from "./AccessTab";
import { getUserAccessFromInventory } from "../../api/inventoryAccess.api";
import FieldsTab from "./FieldsTab";
import { getFieldsFromInventory } from "../../api/fields.api";

export default function InventoryTabs() {
    const { id } = useParams();
    const [inventory, setInventory] = useState<Inventory>();
    const [numbering, setNumbering] = useState<Numbering>();
    const [fields, setFields] = useState<Field[]>([]);
    const [access, setAccess] = useState<{ user: { name: string; id: string } }[]>();

    async function loadInventory() {
        const res = await getInventory(id || "x_x");
        setInventory(res)
    }

    async function loadNumbering() {
        const res = await getNumberingFromInventory(id || "x_x");
        setNumbering(res)
    }

    async function loadAccess() {
        const res = await getUserAccessFromInventory(id || "x_x");
        setAccess(res)
    }

    async function loadFields() {
        const res = await getFieldsFromInventory(id || "x_x");
        setFields(res)
    }

    async function init() {
        await Promise.all([loadFields(), loadNumbering(), loadInventory(), loadAccess()]);
    }

    useEffect(() => {
        init();
    }, [])


    const navigate = useNavigate();
    // const items = useMemo(() => MOCK_ITEMS.filter((x) => x.inventoryId === id), [id]);
    // const canEdit = inv.ownerId === currentUserId || inv.writeUsers.includes(currentUserId); used in editable prop

    return (
        inventory && numbering && <Container className="py-4">
            <Stack direction="horizontal" className="mb-3" gap={2}>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>← Back</Button>
                <h1 className="h4 m-0">{inventory.name}</h1>
                <Badge bg="secondary" className="ms-2">{inventory.code}</Badge>
                <div className="ms-auto text-body-secondary small">{inventory.isPublic ? "Public" : "Restricted"}</div>
            </Stack>

            <Card className="shadow-sm">
                <Card.Body>
                    <Tabs defaultActiveKey="items" className="flex-wrap">
                        <Tab eventKey="items" title="Items">
                            <ItemsTab inventoryId={id || "xxx"} />
                        </Tab>
                        <Tab eventKey="fields" title="Fields">
                            <FieldsTab id={id || ""} loadFields={loadFields} data={fields} editable={inventory.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="discussion" title="Discussion">
                            <DiscussionTab />
                        </Tab>
                        <Tab eventKey="general" title="General settings">
                            <GeneralSettingsTab inv={inventory} editable={inventory.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="numbering" title="Custom numbers">
                            <NumberingTab inv={inventory} numbering={numbering} editable={inventory.ownerId === currentUserId} />
                        </Tab>
                        <Tab eventKey="access" title="Access">
                            <AccessTab inv={inventory} editable={inventory.ownerId === currentUserId} users={access || []} />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
}
