import { BrowserRouter, Routes, Route, Outlet, useParams, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import NavbarSearch from "./Navbar";
import HomePage from '../pages/HomePage'
import InventoryPage, { InventoryTabs } from "../pages/InventoryPage/InventoryPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Shell />}>
                    <Route index element={<HomePage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="admin" element={<InventoryPage />} />
                    <Route path="/inventory/:id" element={<InventoryTabs />} />
                    <Route path="/inventory/:id/items/new" element={<Container className="py-4"><h2 className="h4">New Item (mock)</h2></Container>} />
                    <Route path="/inventory/:id/items/:itemId" element={<Container className="py-4"><h2 className="h4">Item Details (mock)</h2></Container>} />

                    <Route path="inventories/:inventoryId" element={<InventoryDetailPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="tags/:tag" element={<TagResultsPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

function Shell() {
    const handleSearch = (q: string) => {
        if (!q) return;
        console.log("buscar:", q);
    };
    return (
        <>
            <NavbarSearch
                onSearch={handleSearch}
                isAuthenticated={false}
                onLogin={() => console.log("ir a /login")}
                onLogout={() => console.log("cerrar sesión")}
            />
            <Container className="py-5">
                <Outlet />
            </Container>
        </>
    );
}

function InventoryDetailPage() {
    const { inventoryId } = useParams();
    return <h1 className="h4 m-0">Inventory detail: {inventoryId}</h1>;
}

function SearchPage() {
    const [params] = useSearchParams();
    const q = params.get("q") ?? "";
    return <h1 className="h4 m-0">Search results {q && `(q=${q})`}</h1>;
}

function TagResultsPage() {
    const { tag } = useParams();
    return <h1 className="h4 m-0">Results for tag: {tag}</h1>;
}

function NotFoundPage() {
    return <h1 className="h4 m-0">404 – Not Found</h1>;
}