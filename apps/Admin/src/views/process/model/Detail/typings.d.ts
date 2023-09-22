export interface INode {
    id: string;
    parentId: string | null;
    type: string;
    name?: string;
    active: boolean;
    props?: Partial<INodeProps>;
    children?: INode;
    branches?: INode[];
}

export interface IConfig {
    nameGenerator: string;
    summaryGenerator: string;
    ccMember: Partial<ICandidate>;
    forms: { formId: string; multiple: boolean }[];
}

export interface INodeProps {
    // type === ROOT
    assignedUser: IIdentity[];
    // type === APPROVAL || type === DEAL
    candidates: ICandidate;
    gotoWhenReject: string[];
    completeWeight: number;
    rejectWeight: number;
    autoClaim: boolean;
    
    branchBy: string | null;

    // 以下字段前端使用
    isBranchNode: boolean;
    style: Record<string, any>;
}

// 通用类型
export interface IIdentity {
    id: string;
    name: string;
    type: string;
}
export interface ICandidate {
    user?: IBasic[];
    org?: IBasic[];
    role?: IBasic[];
    var: IVar[];
    relation: IRelation[];
}

// user/org/role
export interface IBasic {
    id: string;
    weight?: number;
}

export interface IVar {

}
export interface IRelation {
    weight: number;
    objectSource: {
        source: string;
        value: string;
        upperKey: string;
    };
    objectType: string;
    objectId: string;
    related: {
        objectType: string;
        relation: string;
    }
}