const test = {
  currentId: "node1",
  content: "Is it sunny?",
  parentId: null,
  noChild: {
    currentId: "node2",
    content: "Is it sunny?",
    parentId: "node1",
    noChild: null,
    yesChild: {
      currentId: "node4",
      content: "Is it sunny?",
      parentId: "node2",
      noChild: null,
      yesChild: null,
    },
  },
  yesChild: {
    currentId: "node3",
    content: "Is it sunny?",
    parentId: "node1",
    noChild: {
      currentId: "node5",
      content: "Is it sunny?",
      parentId: "node3",
      noChild: null,
      yesChild: null,
    },
    yesChild: {
      currentId: "node6",
      content: "Is it sunny?",
      parentId: "node3",
      noChild: null,
      yesChild: null,
    },
  },
};

const inorderToList = (node, acc) => {
  if (node) {
    let { parentId, content, currentId, yesChild, noChild } = node;
    let parsedNode = { currentId, content, parentId };
    parsedNode.noChildId = noChild ? noChild.currentId : null;
    parsedNode.yesChildId = yesChild ? yesChild.currentId : null;
    acc.push(parsedNode);
    inorderToList(node.noChild, acc);
    inorderToList(node.yesChild, acc);
  }
  return acc;
};

function findById(list, currentId) {
  // Filter the list to find objects with the given currentId
  const result = list.filter((item) => item.currentId === currentId);
  return result[0];
}

function printFromList(nodeList) {
  let root = nodeList[0];
  if (!root) return; // Base case for empty tree

  let stack = []; // Initialize stack for iterative DFS
  stack.push(root); // Push the root node onto the stack

  while (stack.length > 0) {
    let currentNode = stack.pop(); // Pop the top node from the stack

    // Process the current node (e.g., print its value)
    console.log(currentNode);

    // Push the right child onto the stack if it exists
    if (currentNode.noChildId) {
      stack.push(findById(nodeList, currentNode.noChildId));
      console.log("No pushed");
    }

    // Push the left child onto the stack if it exists
    if (currentNode.yesChildId) {
      stack.push(findById(nodeList, currentNode.yesChildId));
      console.log("Yes pushed");
    }
  }
}

const testArray = inorderToList(test, []);
// console.log(testArray);

printFromList(testArray);
