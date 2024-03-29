import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGetTree } from "../../../apiControllers/treeApiController";
import UserTree from "../TreeComponents/UserTree";
import { useLocation } from "react-router-dom";

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
      // console.log('Tree data:', response.data);
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
