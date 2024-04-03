import React from 'react';
import '../css./ZoomControls.css';
/**
 * Component for rendering zoom controls that allow the user to zoom in and out.
 *
 * @param {Object} props - The props for the ZoomControls component.
 * @param {function} props.onZoomIn - Callback function to be called when the zoom in button is clicked.
 * @param {function} props.onZoomOut - Callback function to be called when the zoom out button is clicked.
 * @returns {React.ReactElement} The ZoomControls component with two buttons for zooming in and out.
 */
const ZoomControls = ({ onZoomIn, onZoomOut }) => {
    return (
        <div className="zoom-controls">
            <button className="zoom-button" onClick={onZoomIn}>+</button>
            <button className="zoom-button" onClick={onZoomOut}>−</button>
        </div>
    );
};

export default ZoomControls;
