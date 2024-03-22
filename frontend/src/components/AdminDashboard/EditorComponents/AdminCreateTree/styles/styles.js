const styles = {
  nodeContainer: {
    marginBottom: "20px",
  },
  deleteButton: {
    width: "40px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ccc",
    padding: "10px",
  },
  dropdownNodeYesChild: {
    width: "calc(100% - 40px)",
    backgroundColor: "rgb(230, 255, 230)",
  },
  dropdownNodeNoChild: {
    width: "calc(100% - 40px)",
    backgroundColor: "rgb(255, 230, 230)",
  },
  existingNodesDropdownContainer: {
    marginLeft: "20px",
    width: "calc(100% - 20px)",
    maxHeight: "200px" /* Set the maximum height */,
    height:
      "min-content" /* Allow the container to grow up to the maximum height */,
    overflowY: "auto" /* Enable vertical scrolling */,
  },
  existingNodesDropdownItem: {
    width: "100%",
    cursor: "pointer",
  },
  leafNode: {
    backgroundColor: "rgb(255, 255, 235)",
  },
};

export default styles;
