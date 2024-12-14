import React from 'react';
import './EventModal.css';  // Using existing modal styles

const PublicEventsWrapper = ({ isOpen, onClose, userEmail }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="unavailable-content">
          <h2>Public Events</h2>
          <div className="unavailable-message">
            <i className="unavailable-icon">🚧</i>
            <p>This feature is currently under development.</p>
            <p className="coming-soon">Coming Soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventsWrapper;