import React, { useState } from 'react';
import './EventModal.css';

const DEFAULT_THEME = '#17726d';
const DEFAULT_BACKGROUND = '#eae4d2';

const SettingsModal = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  const [themeColor, setThemeColor] = useState(currentTheme);
  const [backgroundColor, setBackgroundColor] = useState(
    localStorage.getItem('backgroundColor') || DEFAULT_BACKGROUND
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onThemeChange({ themeColor, backgroundColor });
    onClose();
  };

  const handleReset = () => {
    setThemeColor(DEFAULT_THEME);
    setBackgroundColor(DEFAULT_BACKGROUND);
    onThemeChange({ 
      themeColor: DEFAULT_THEME, 
      backgroundColor: DEFAULT_BACKGROUND 
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Theme Settings</h2>
        <div className="settings-form">
          <div className="color-picker">
            <label>Theme Color:</label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            />
          </div>
          <div className="color-picker">
            <label>Background Color:</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleReset} className="reset-button">Reset to Default</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 