import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGetTree } from "../../../apiControllers/treeApiController";
import UserTree from "../TreeComponents/jsx/UserTree";
import { useLocation } from "react-router-dom";

/**
 * Component for building and displaying a user tree based on the tree data fetched from an API.
 *
 * @returns {React.ReactElement} The UserTree component with the fetched tree data, or a loading message if the data is not yet available.
 */
function BuildUserTree() {
  const { id } = useParams();
  const [treeData, setTreeData] = useState(null);
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/trees/preview");
    if (isPreviewMode) {
      const data = sessionStorage.getItem("previewData");
      setTreeData(JSON.parse(data));
    } else {
      fetchTreeData();
    }
  }, [id, state]);

  const fetchTreeData = async () => {
    try {
      const response = await apiGetTree(id);
      setTreeData(response.data);
    } catch (error) {
      console.error("Error fetching tree:", error);
    }
  };

  if (!treeData) {
    return <div>Loading...</div>;
  }

  return <UserTree treeData={treeData} />;
}

export default BuildUserTree;
