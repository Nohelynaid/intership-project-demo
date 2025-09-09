import type { CreateField } from "../models/Inventory.type";
import { API_URL } from "./endpoints";

export async function getFieldsFromInventory(inventoryId: string) {
    try {
        const res = await fetch(API_URL + "fields/" + inventoryId + '/all');
        if (!res.ok) throw new Error("error when loading fields from inventory");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function createFields(data: CreateField[]) {
    try {
        const response = await fetch(API_URL + "fields/many", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();

    } catch (err) {
        console.error(err);
    }
}