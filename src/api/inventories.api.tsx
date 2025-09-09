import type { CreateInventory } from "../models/Inventory.type";
import { API_URL } from "./endpoints";

export async function loadTop5() {
    try {
        const res = await fetch(API_URL + "inventories/top5");
        if (!res.ok) throw new Error("error when loading top5 inventories");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function loadAll() {
    try {
        const res = await fetch(API_URL + "inventories");
        if (!res.ok) throw new Error("error when loading all inventories");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function loadAllTags() {
    try {
        const res = await fetch(API_URL + "inventories/tags");
        if (!res.ok) throw new Error("error when loading all tags");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function loadInventoriesFromUser(userId: string) {
    try {
        const res = await fetch(API_URL + "inventories/" + userId + '/all');
        if (!res.ok) throw new Error("error when loading all inventories from user");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function getInventory(id: string) {
    try {
        const res = await fetch(API_URL + "inventories/" + id);
        if (!res.ok) throw new Error("error when loading inventory");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

export async function createInventory(data: CreateInventory) {
    try {
        const response = await fetch(API_URL + "inventories/", {
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