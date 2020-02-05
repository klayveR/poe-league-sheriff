export type CharacterItems = Array<CharacterItem>;

export interface CharacterItem {
    verified: boolean;
    w: number;
    h: number;
    icon: string;
    league: string;
    id: string;
    influences?: Influences | null;
    shaper?: boolean | null;
    name: string;
    typeLine: string;
    identified: boolean;
    ilvl: number;
    requirements?: RequirementsEntity[];
    implicitMods?: string[];
    explicitMods?: string[];
    craftedMods?: string[];
    frameType: number;
    x: number;
    y: number;
    inventoryId: string;
    sockets?: SocketsEntity[];
    properties?: PropertiesEntity[];
    socketedItems?: SocketedItemsEntity[];
    corrupted?: boolean;
    flavourText?: string[];
    incubatedItem?: IncubatedItem;
    utilityMods?: string[];
    descrText?: string;
    elder?: boolean;
    enchantMods?: string[];
}

export interface Influences {
    shaper?: boolean;
    redeemer?: boolean;
    elder?: boolean;
    warlord?: boolean;
    hunter?: boolean;
    crusader?: boolean;
}

export interface RequirementsEntity {
    name: string;
    values?: (string | number)[][];
    displayMode: number;
}

export interface SocketsEntity {
    group: number;
    attr: string;
    sColour: string;
}

export interface PropertiesEntity {
    name: string;
    values?: (string | number)[][];
    displayMode: number;
    type?: number;
}

export interface SocketedItemsEntity {
    verified: boolean;
    w: number;
    h: number;
    icon: string;
    id: string;
    abyssJewel?: boolean;
    name: string;
    typeLine: string;
    identified: boolean;
    ilvl: number;
    properties?: PropertiesEntity[];
    requirements?: RequirementsEntity[];
    explicitMods?: string[];
    descrText: string;
    frameType: number;
    socket: number;
    colour?: string;
    support?: boolean;
    corrupted?: boolean;
    secDescrText?: string;
    additionalProperties?: AdditionalPropertiesEntity[];
    nextLevelRequirements?: NextLevelRequirementsEntity[];
    hybrid?: Hybrid;
}

export interface AdditionalPropertiesEntity {
    name: string;
    values?: (string | number)[][];
    displayMode: number;
    progress: number;
    type: number;
}

export interface NextLevelRequirementsEntity {
    name: string;
    values?: (string | number)[][];
    displayMode: number;
}

export interface Hybrid {
    isVaalGem: boolean;
    baseTypeName: string;
    properties?: PropertiesEntity[];
    explicitMods?: string[];
    secDescrText: string;
}

export interface IncubatedItem {
    name: string;
    level: number;
    progress: number;
    total: number;
}
