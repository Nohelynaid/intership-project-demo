import { API_URL } from "./endpoints";

export async function getUserAccessFromInventory(inventoryId: string) {
    try {
        const res = await fetch(API_URL + "inventory-access/" + inventoryId + '/all');
        if (!res.ok) throw new Error("error when loading user access from inventory");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

