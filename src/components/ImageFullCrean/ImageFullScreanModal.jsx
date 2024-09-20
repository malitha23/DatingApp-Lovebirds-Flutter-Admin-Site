import React, { useState, useRef, useEffect } from "react";
import './ImageFullScreanModalCss.css'; // Import the CSS for styling

const ImageFullScreanModal = ({ isOpen, onClose, content }) => {
    const [scale, setScale] = useState(1); // State to manage zoom level
    const [position, setPosition] = useState({ x: 0, y: 0 }); // State to manage drag position
    const [isDragging, setIsDragging] = useState(false); // State to track drag status
    const startPos = useRef({ x: 0, y: 0 }); // Store initial mouse position
    const imageRef = useRef(null);

    // Handle mouse down for dragging
    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent default image drag behavior
        setIsDragging(true);
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };



    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        // Handle mouse move for dragging
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - startPos.current.x,
                    y: e.clientY - startPos.current.y,
                });
            }
        };

        if (isOpen) {
            // Add event listeners for dragging
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        // Clean up event listeners on component unmount or isOpen change
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isOpen]);

    if (!isOpen) return null;

    // Determine if content is a URL or an image element
    const isImageURL = typeof content === 'string';
    const imgSrc = isImageURL ? content : '';

    const handleZoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 5)); // Limit max scale
    };

    const handleZoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 1)); // Limit min scale
    };

    return (
        <div className="modal-overlay2" onClick={onClose}>
            <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <div className="controls">
                    <button className="zoom-button" onClick={handleZoomIn}>Zoom In</button>
                    <button className="zoom-button" onClick={handleZoomOut}>Zoom Out</button>
                </div>
                <div className="image-zoom-container2">
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: isDragging ? "grabbing" : "grab", // Change cursor based on dragging status
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <img
                            ref={imageRef}
                            src={imgSrc}
                            alt="Zoomable content"
                            style={{
                                width: "auto",
                                height: "auto",
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                transition: isDragging ? "none" : "transform 0.3s ease", // Smooth transform when not dragging
                            }}
                            draggable={false} // Disable default drag behavior
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageFullScreanModal;
