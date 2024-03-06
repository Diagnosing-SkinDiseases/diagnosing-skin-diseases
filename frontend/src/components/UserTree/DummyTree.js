const DUMMY_DATA = {
    "_id": "65cf3632790be1df5b052ce4",
    "name": "Lesion",
    "nodes": [
        {
            "currentId": "node1",
            "content": "The question for node 1?",
            "parentId": null,
            "noChildId": "node2",
            "yesChildId": "node3",
            "_id": "65cf3632790be1df5b052ce5"
        },
        {
            "currentId": "node2",
            "content": "The question for node 2?",
            "parentId": "node1",
            "noChildId": "node5",
            "yesChildId": "node4",
            "_id": "65cf3632790be1df5b052ce6"
        },
        {
            "currentId": "node4",
            "content": "The question for node 4?",
            "parentId": "node2",
            "noChildId": null,
            "yesChildId": null,
            "_id": "65cf3632790be1df5b052ce7"
        },
        {
            "currentId": "node3",
            "content": "The question for node 3?",
            "parentId": "node1",
            "noChildId": "node6",
            "yesChildId": "node7",
            "_id": "65cf3632790be1df5b052ce8"
        },
        {
            "currentId": "node5",
            "content": "The question for node 5?",
            "parentId": "node2",
            "noChildId": null,
            "yesChildId": "node8",
            "_id": "65cf3632790be1df5b052ce9"
        },
        {
            "currentId": "node6",
            "content": "The question for node 6?",
            "parentId": "node3",
            "noChildId": null,
            "yesChildId": null,
            "_id": "65cf3632790be1df5b052cea"
        },
        {
            "currentId": "node7",
            "content": "The question for node 7?",
            "parentId": "node3",
            "noChildId": null,
            "yesChildId": "node9",
            "_id": "65cf3632790be1df5b052ceb"
        },
        {
            "currentId": "node8",
            "content": "The question for node 8?",
            "parentId": "node5",
            "noChildId": null,
            "yesChildId": null,
            "_id": "65cf3632790be1df5b052cec"
        },
        {
            "currentId": "node9",
            "content": "The question for node 9?",
            "parentId": "node7",
            "noChildId": null,
            "yesChildId": null,
            "_id": "65cf3632790be1df5b052ced"
        }
    ],
    "about": "Sample",
    "status": "PUBLISHED",
    "__v": 0
}

export default DUMMY_DATA;
