import { API_URL } from "./endpoints";

export async function getItemsFromInventory(inventoryId: string) {
    try {
        const res = await fetch(API_URL + "items/" + inventoryId + '/all');
        if (!res.ok) throw new Error("error when loading items from inventory");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

