import React from 'react';

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
    return (
        <div className="zoom-controls" style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: 'white',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
            <button onClick={onZoomIn} style={{ margin: '5px' }}>+</button>
            <button onClick={onZoomOut} style={{ margin: '5px' }}>−</button>
        </div>
    );
};

export default ZoomControls;
