export type Inventory = {
    id: string;
    name: string;
    code: string;
    description?: string;
    image?: string;
    ownerId: string;
    owner: { name: string };
    tags: string[];
    _count: { items: number; };
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
    isPublic: boolean;
};

export type Inventory_2 = {
    id: string;
    code: string;
    name: string;
    description?: string;
    image?: string;
    ownerId: string;
    writeUsers: string[]; // user IDs with write access
    tags: string[];
    itemCount: number;
    updatedAt: string; // ISO date
    numberingPattern: string; // e.g. {CODE}-{YYYY}-{SEQ:5}
    isPublic: boolean;
    fields: InvField[];
};


export type InvField = {
    key: string;
    name: string;
    type: "string" | "number" | "date" | "boolean" | "enum";
    required?: boolean;
    options?: string[]; // for enum
};

export type Item = {
    id: string;
    inventoryId: string;
    invNumber: string;
    data: Record<string, unknown>;
    createdAt: string;
};

export type Numbering = {
    id: string;
    inventoryId: string;
    pattern: string;
    counter: number;
}

type FieldType = "string" | "number" | "boolean" | "date" | "enum"

export type Field = {
    name: string;
    id: string;
    inventoryId: string;
    key: string;
    type: FieldType;
    required: boolean;
    options: string[];
    optionsString: string;
    position: number;
}


export type CreateInventory = {
    code: string;
    name: string;
    description: string;
    ownerId: string;
    isPublic: boolean;
    image: string | null; //not used so far
}

export type CreateField = {
    name: string,
    inventoryId: string,
    key: string,
    type: FieldType,
    required: boolean,
    options: string[],
    position: number
}