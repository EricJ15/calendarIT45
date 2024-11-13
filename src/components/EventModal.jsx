import React, { useState, useEffect } from 'react';
import './EventModal.css';

const EventModal = ({ isOpen, onClose, event, onSave, onDelete, onUpdate, mode = 'view' }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [currentMode, setCurrentMode] = useState(mode);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (event) {
      setEventData(event);
    } else {
      setEventData({
        title: '',
        description: '',
        date: '',
        location: '',
      });
    }
    setCurrentMode(mode);
  }, [event, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMode === 'edit') {
      onUpdate(eventData);
    } else if (currentMode === 'create') {
      onSave(eventData);
    }
    onClose();
  };

  const handleEditClick = () => {
    setCurrentMode('edit');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>{currentMode === 'view' ? 'Event Details' : currentMode === 'edit' ? 'Edit Event' : 'Create Event'}</h2>
          
          {currentMode === 'view' ? (
            <div className="event-details">
              <h3>{eventData.title}</h3>
              <p><strong>Description:</strong> {eventData.description}</p>
              <p><strong>Date:</strong> {eventData.date}</p>
              <p><strong>Location:</strong> {eventData.location}</p>
              <div className="button-group">
                <button type="button" onClick={() => onDelete(event.id)}>Delete</button>
                <button type="button" onClick={handleEditClick}>Edit</button>
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => setEventData({...eventData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({...eventData, date: e.target.value})}
                  min={getCurrentDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => setEventData({...eventData, location: e.target.value})}
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit">{currentMode === 'edit' ? 'Update' : 'Create'}</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventModal; 