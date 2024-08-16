const SampleTree = {
  currentId: "node0",
  content: "Root",
  parentId: null,
  noChild: [
    {
      currentId: "node1",
      content: "A",
      parentId: "node0",
      noChild: [
        {
          currentId: "node5",
          content: "C",
          parentId: "node1",
          noChild: [],
          yesChild: [],
          xPos: -400,
          yPos: 500,
        },
      ],
      yesChild: [
        {
          currentId: "node7",
          content: "D",
          parentId: "node1",
          noChild: [],
          yesChild: [],
          xPos: 0,
          yPos: 500,
        },
      ],
      xPos: -200,
      yPos: 250,
    },
  ],
  yesChild: [
    {
      currentId: "node3",
      content: "B",
      parentId: "node0",
      noChild: [
        {
          currentId: "node9",
          content: "E",
          parentId: "node3",
          noChild: [],
          yesChild: [],
          xPos: 999.4869867115065,
          yPos: 516.9854664561216,
        },
      ],
      yesChild: [
        {
          currentId: "node11",
          content: "F",
          parentId: "node3",
          noChild: [],
          yesChild: [],
          xPos: 1399.4869867115065,
          yPos: 516.9854664561216,
        },
      ],
      xPos: 1199.4869867115065,
      yPos: 266.98546645612157,
    },
  ],
  xPos: 501.07126045558596,
  yPos: -100.81868251747106,
};

export default SampleTree;
