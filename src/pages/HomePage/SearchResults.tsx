import { useMemo } from "react";
import InventoriesTable from "./InventoriesTable";
import type { Inventory } from "../../models/Inventory.type";

export default function SearchResults({ tag, inventories }: { tag: string; inventories: Inventory[] }) {
    const filtered = useMemo(() => inventories.filter((i) => i.name?.includes(tag)), [tag, inventories]);
    return (
        <InventoriesTable title={`Results for tag: ${tag}`} right={`${filtered.length} result(s)`} inventories={filtered} />
    );
}