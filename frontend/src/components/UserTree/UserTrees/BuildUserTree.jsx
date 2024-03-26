import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { apiGetTree } from "../../../apiControllers/treeApiController";
import UserTree from "../TreeComponents/UserTree";

function BuildUserTree() {
    const { id } = useParams();
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        fetchTreeData();
    }, [id]);

    const fetchTreeData = async () => {
        try {
            const response = await apiGetTree(id);
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

export default BuildUserTree;
