import { API_URL } from "./endpoints";

export async function getNumberingFromInventory(inventoryId: string) {
    try {
        const res = await fetch(API_URL + "numberings/" + inventoryId + '/one');
        if (!res.ok) throw new Error("error when loading numbering from inventory");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

