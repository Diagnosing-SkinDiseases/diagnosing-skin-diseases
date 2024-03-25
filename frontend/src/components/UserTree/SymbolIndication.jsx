import React from 'react';
import './SymbolIndication.css';

const SymbolIndication = () => {
    const blueNode = "#1E90FF";
    const yellowNode = "#FFD700";
    const greenNode = "#6ad669";
    return (
        <div className="symbol-indication">
            <div className="node-container">
                <div className="node-symbol currentNode-style" style={{ backgroundColor: greenNode }}></div>
                <h4 className="node-symbol-text">You Are Here</h4>
            </div>
            <div className="node-container">
                <div className="node-symbol" style={{ backgroundColor: blueNode }}></div>
                <h4 className="node-symbol-text">Question Node</h4>
            </div>
            <div className="node-container">
                <div className="node-symbol" style={{ backgroundColor: yellowNode }}></div>
                <h4 className="node-symbol-text">Result Node</h4>
            </div>
        </div>
    );
}

export default SymbolIndication;
