export interface INode {
    id: string;
    parentId: string | null;
    type: string;
    name?: string;
    active: boolean;
    props?: Record<string, any>;
    children?: INode;
    branches?: INode[];
}

export interface IConfig {
    nameGenerator: string;
    summaryGenerator: string;
    ccMember: Partial<ICandidate>;
    forms: { formId: string; multiple: boolean }[];
}

// 通用类型
export interface IDentity {
    id: string;
    name: string;
    type: string;
}
export interface ICandidate {
    user: any[];
    org: any[];
    role: any[];
    var: any[];
    relation: any[];
}