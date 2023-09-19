export interface INode {
    id: string;
    parentId: string;
    type: string;
    name: string;
    active: boolean;
    props: Record<string, any>;
    children?: INode;
    branches?: INode[];
}