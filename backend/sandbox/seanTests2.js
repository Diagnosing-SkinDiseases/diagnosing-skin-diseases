let test = [
  {
    currentId: "node1",
    content: "Is it sunny?",
    parentId: null,
    noChildId: "node2",
    yesChildId: "node3",
    _id: "65fa0e934ea0f426eb0cbc6f",
  },
  {
    currentId: "node2",
    content: "Is it sunny?",
    parentId: "node1",
    yesChildId: "node4",
    noChildId: "node5",
    _id: "65fa0e934ea0f426eb0cbc70",
  },
  {
    currentId: "node3",
    content: "Is it sunny?",
    parentId: "node1",
    noChildId: "node2",
    yesChildId: null,
    _id: "65fa0e934ea0f426eb0cbc72",
  },
  {
    currentId: "node4",
    content: "Is it sunny?",
    parentId: "node2",
    noChildId: "node3",
    yesChildId: "node5",
    _id: "65fa0e934ea0f426eb0cbc72",
  },
  {
    currentId: "node5",
    content: "Is it sunny?",
    parentId: "node2",
    noChildId: null,
    yesChildId: null,
    _id: "65fa0e934ea0f426eb0cbc71",
  },
];

function findNodeById(nodes, nodeId) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].currentId === nodeId) {
      let match = nodes[i];
      return match;
    }
  }
  return nodeId;
}

function findRootNode(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].parentId === null) {
      let match = nodes[i];
      nodes.splice(i, 1);
      return { nodes, node: match };
    }
  }
  return null;
}

function replaceChildIds(nodes) {
  nodes.forEach((node) => {
    if (node.yesChildId) {
      node.yesChild = { currentId: node.yesChildId };
      delete node.yesChildId;
    }
    if (node.noChildId) {
      node.noChild = { currentId: node.noChildId };
      delete node.noChildId;
    }
  });
  return nodes;
}

function insertNode(root, newNode) {
  if (!root) {
    return newNode;
  }
  if (root.yesChild) {
    if (root.yesChild.currentId === newNode.currentId) {
      root.yesChild = newNode;
    }
  }

  if (root.noChild) {
    if (root.noChild.currentId === newNode.currentId) {
      root.noChild = newNode;
    }
  }

  if (root.yesChild) {
    insertNode(root.yesChild, newNode);
  }
  if (root.noChild) {
    insertNode(root.noChild, newNode);
  }
}

function insertNested(root, nodesList) {
  console.log("Trigger");
  if (root.yesChild) {
    if (Object.keys(root.yesChild).length === 1) {
      root.yesChild = findNodeById(nodesList, root.yesChild.currentId);
    }
  }

  if (root.noChild) {
    if (Object.keys(root.noChild).length === 1) {
      root.noChild = findNodeById(nodesList, root.noChild.currentId);
    }
  }

  if (root.yesChild) {
    insertNested(root.yesChild, nodesList);
  }
  if (root.noChild) {
    insertNested(root.noChild, nodesList);
  }
}

function deepCopy(obj) {
  if (Array.isArray(obj)) {
    // If it's an array, create a new array and recursively deep copy its elements
    return obj.map(deepCopy);
  } else if (typeof obj === "object" && obj !== null) {
    // If it's an object, create a new object and recursively deep copy its properties
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepCopy(value)])
    );
  } else {
    // For primitive types, just return the value
    return obj;
  }
}

function fromList(nodes) {
  let nodesCopy = deepCopy(nodes);
  nodesCopy = replaceChildIds(nodesCopy);
  let { node: root, nodes: noRoot } = findRootNode(nodesCopy);
  nodesCopy = noRoot;

  while (nodesCopy.length !== 0) {
    let toInsertNode = nodesCopy[0];
    console.log("root", root);
    console.log("new", toInsertNode);

    nodesCopy.splice(0, 1);
    insertNode(root, toInsertNode);
  }

  insertNested(root, nodes);
  return root;
}

function prettifyJSON(jsonString) {
  try {
    const parsedObject = JSON.parse(jsonString);
    return JSON.stringify(parsedObject, null, 2);
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return null;
  }
}

let treeResult = fromList(test);
let result = JSON.stringify(treeResult);
result = prettifyJSON(result);
console.log("Result", result);
