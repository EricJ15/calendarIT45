import React, { useState } from 'react';
import './EventModal.css';

const SettingsModal = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  const [themeColor, setThemeColor] = useState(currentTheme || '#17726d');
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || '#eae4d2');

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setThemeColor(newColor);
    onThemeChange({ themeColor: newColor, backgroundColor });
  };

  const handleBackgroundChange = (e) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    onThemeChange({ themeColor, backgroundColor: newColor });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Settings</h2>
        <div className="settings-content">
          <div className="form-group">
            <label>Theme Color (Buttons & Events):</label>
            <div className="color-picker-container">
              <input
                type="color"
                value={themeColor}
                onChange={handleColorChange}
                className="color-picker"
              />
              <span className="color-value">{themeColor}</span>
            </div>
          </div>
          <div className="form-group">
            <label>Background Color:</label>
            <div className="color-picker-container">
              <input
                type="color"
                value={backgroundColor}
                onChange={handleBackgroundChange}
                className="color-picker"
              />
              <span className="color-value">{backgroundColor}</span>
            </div>
          </div>
        </div>
        <div className="button-group">
          <button type="button" className="submit-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 