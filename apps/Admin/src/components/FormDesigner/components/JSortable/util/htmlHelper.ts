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
            : fatherNode.children[position - 1].nextSibling;
            console.log(refNode, position)
    fatherNode.insertBefore(node, refNode);
}

function insertNodesAt(fatherNode, nodes, position) {
    const refNode =
        position === 0
            ? fatherNode.children[0]
            : fatherNode.children[position - 1].nextSibling;
        nodes.forEach(item => {
            fatherNode.insertBefore(item, refNode);
        })
    
}

export { insertNodeAt, removeNode, removeNodes, insertNodesAt };