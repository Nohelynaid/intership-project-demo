import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
                    <Route path="/inventory/:id" element={<InventoryTabs />} />
                    <Route path="/inventory/:id/items/new" element={<Container className="py-4"><h2 className="h4">New Item (mock)</h2></Container>} />
                    <Route path="/inventory/:id/items/:itemId" element={<Container className="py-4"><h2 className="h4">Item Details (mock)</h2></Container>} />
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

function NotFoundPage() {
    return <h1 className="h4 m-0">404 – Not Found</h1>;
}