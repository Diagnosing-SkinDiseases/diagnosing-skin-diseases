import React, { useState, useEffect } from "react";
import { apiGetTree } from "../../apiControllers/treeApiController";
import UserTree from "./UserTree";

function WhiteMacules() {
    const [treeData, setTreeData] = useState(null);
    const treeId = "65f4b0aa08572dd23283e53a"; 

    useEffect(() => {
        fetchTreeData();
    }, []);

    const fetchTreeData = async () => {
        try {
            const response = await apiGetTree(treeId);
            setTreeData(response.data);
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
