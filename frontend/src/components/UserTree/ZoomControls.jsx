import React from 'react';
import './ZoomControls.css';

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
    return (
        <div className="zoom-controls">
            <button className="zoom-button" onClick={onZoomIn}>+</button>
            <button className="zoom-button" onClick={onZoomOut}>−</button>
        </div>
    );
};

export default ZoomControls;
