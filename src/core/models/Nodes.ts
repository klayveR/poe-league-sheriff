export type Nodes = Array<Node>;

export interface Node {
    id: number;
    icon: string;
    ks: boolean;
    not: boolean;
    dn: string;
    m: boolean;
    isJewelSocket: boolean;
    isMultipleChoice: boolean;
    isMultipleChoiceOption: boolean;
    passivePointsGranted: number;
    spc?: number[];
    sd?: string[];
    g: number;
    o: number;
    oidx: number;
    sa: number;
    da: number;
    ia: number;
    out?: number[];
    in?: number[];
    ascendancyName?: string;
    isAscendancyStart?: boolean;
    reminderText?: string[];
    isBlighted?: boolean;
    flavourText?: string[];
}
