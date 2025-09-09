import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TagCloud from "./TagCloud";
import SearchResults from "./SearchResults";
import InventoriesTable from "./InventoriesTable";
import { loadAll, loadAllTags, loadTop5 } from "../../api/inventories.api";

export default function HomePage() {

    const [top5, setTop5] = useState([]);
    const [allInventories, setAllInventories] = useState([]);
    const [tags, setTags] = useState([]);

    async function loadInventoriesTop5() {
        const res = await loadTop5();
        setTop5(res)
    }

    async function loadInventories() {
        const res = await loadAll();
        setAllInventories(res)
    }

    async function loadInventoryTags() {
        const res = await loadAllTags();
        setTags(res)
    }

    async function init() {
        await Promise.all([loadInventoriesTop5(), loadInventories(), loadInventoryTags()]);
    }

    useEffect(() => {
        init();
    }, []);

    const [activeTag, setActiveTag] = useState<string | null>(null);

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col xs={12} xl={10} xxl={9} className="w-100">
                    <Row className="mb-4 g-3 align-items-center">
                        <Col xs={12} md={8} className="text-center text-md-start w-100">
                            <h1 className="h3 mb-1">Inventory Dashboard</h1>
                            <p className="text-body-secondary mb-0">Latest inventories, most popular, and quick tag filters.</p>
                        </Col>
                        <Col xs={12} md={4} className="text-center text-md-end w-100">
                            {activeTag && (
                                <Button variant="outline-secondary" size="sm" onClick={() => setActiveTag(null)}>
                                    Clear filter
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <Row className="g-4 mt-1">
                        <Col xs={12} className="w-100">
                            <TagCloud data={tags} onClick={setActiveTag} />
                        </Col>
                    </Row>
                    <br />
                    <Row className="g-4 justify-content-center">
                        {activeTag ? (
                            <Col xs={12} lg={12} className="w-100">
                                <SearchResults tag={activeTag} inventories={allInventories} />
                            </Col>
                        ) : (
                            <Col xs={12} lg={12} className="w-100">
                                <InventoriesTable title="Latest inventories" right={`${allInventories.length}`} inventories={allInventories} />
                            </Col>
                        )}
                        <Col xs={12} lg={12} className="w-100">
                            <InventoriesTable title="Top 5 popular" right={"Top 5"} inventories={top5} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
