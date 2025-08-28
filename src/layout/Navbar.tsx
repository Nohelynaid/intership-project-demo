import { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
// (Opcional) si quieres un menú de usuario en vez de solo botón:
// import NavDropdown from "react-bootstrap/NavDropdown";

type Props = {
    onSearch: (q: string) => void;
    isAuthenticated?: boolean;
    userName?: string;
    onLogin?: () => void;
    onLogout?: () => void;
};

export default function NavbarSearch({
    onSearch,
    isAuthenticated = false,
    userName,
    onLogin,
    onLogout,
}: Props) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(query.trim());
    };

    return (
        <Navbar
            expand="lg"
            bg="dark"
            data-bs-theme="dark"
            fixed="top"
            className="shadow-sm"
        >
            <Container>
                <Navbar.Brand href="/">Inventory Management</Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/inventory">Inventory</Nav.Link>
                    </Nav>

                    <Form className="d-flex me-2 my-2 my-lg-0" onSubmit={handleSubmit} role="search">
                        <InputGroup>
                            <Form.Control
                                type="search"
                                placeholder="Buscar…"
                                aria-label="Buscar"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button type="submit">Buscar</Button>
                        </InputGroup>
                    </Form>

                    {isAuthenticated ? (
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-white-50 small d-none d-lg-inline">
                                {userName ? `Hola, ${userName}` : "Conectado"}
                            </span>
                            <Button variant="outline-light" size="sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline-light" size="sm" onClick={onLogin}>
                            Login
                        </Button>
                    )}

                    {/* Alternativa con menú (descomenta el import y este bloque)
          {isAuthenticated ? (
            <Nav>
              <NavDropdown
                align="end"
                title={<span className="text-white">{userName || "Cuenta"}</span>}
                id="user-menu"
              >
                <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Button variant="outline-light" size="sm" onClick={onLogin}>
              Login
            </Button>
          )}
          */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
