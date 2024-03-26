import React, { useState, useEffect } from "react";
import { apiGetTree } from "../../apiControllers/treeApiController";
import UserTree from "./UserTree";

function WhiteMacules() {
    const [treeData, setTreeData] = useState(null);
    const treeId = "65f4b0aa08572dd23283e53a";
    // const treeId = "660204acfd6c38f254a27e07"; //skewed tree example
    // const treeId = "65fbabe95328f22cf766a1c1"; //two parents example


    useEffect(() => {
        fetchTreeData();
    }, []);

    const fetchTreeData = async () => {
        try {
            const response = await apiGetTree(treeId);
            setTreeData(response.data);
            // console.log('Tree data:', response.data);
        } catch (error) {
            console.error('Error fetching tree:', error);
        }
    };

    if (!treeData) {
        return <div>Loading...</div>;
    }

    return <UserTree treeData={treeData} />;
}

export default WhiteMacules;
