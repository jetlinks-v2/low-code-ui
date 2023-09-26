import { map } from "lodash-es";

function removeNode(node) {
    if (node.parentElement !== null) {
        node.parentElement.removeChild(node);
    }
}

function removeNodes(node: any[]) {
    node.forEach((item) => {
        if (item?.parentElement !== null) {
            item.parentElement?.removeChild(item);
        }
    })
}

function insertNodeAt(fatherNode, node, position) {
    const refNode =
        position === 0
            ? fatherNode.children[0]
            : fatherNode.children[position - 1]?.nextSibling;
    fatherNode.insertBefore(node, refNode);
}

function insertNodesAt(fatherNode, oldNodes, newNodes) {
    const oldIndex = map(oldNodes, 'index')
    const newIndex = map(newNodes, 'index')
    // 从上到下oldIndex[0] >= newIndex.slice(-1) // newIndex.slice(-1)
    let refNode = undefined
    if(oldIndex[0] >= newIndex[newIndex.length - 1]){
        refNode = fatherNode.children[newIndex[newIndex.length - 1]]
    } else { // 从下到上oldIndex.slice(-1) <= newIndex[0] // newIndex[0]
        refNode = fatherNode.children[newIndex[0]]
    }
    newNodes.forEach(item => {
        fatherNode.insertBefore(item.multiDragElement, refNode);
    })
}

export { insertNodeAt, removeNode, removeNodes, insertNodesAt };