import NavbarSearch from "./layout/Navbar";

export default function App() {
  const handleSearch = (q: string) => {
    if (!q) return;
    console.log("buscar:", q);
  };

  return (
    <>
      <NavbarSearch onSearch={handleSearch} />
    </>
  );
}