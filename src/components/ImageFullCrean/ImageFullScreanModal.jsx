import React from 'react';
import './ImageFullScreanModalCss.css'; // Import the CSS for styling

const ImageFullScreanModal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    // Determine if content is a URL or an image element
    const isImageURL = typeof content === 'string';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <div className="image-container">
                    {isImageURL ? (
                        <img
                            src={content}
                            alt="Full screen"
                            className="fullscreen-image"
                        />
                    ) : (
                        content // Assuming content is an image element
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageFullScreanModal;
