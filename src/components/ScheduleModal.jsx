import React from 'react';
import './EventModal.css';

const ScheduleModal = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>My Schedule</h2>
        <div className="schedule-list">
          {events.length === 0 ? (
            <p>No events scheduled</p>
          ) : (
            events.map(event => (
              <div key={event.id} className="schedule-item">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {event.start}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <hr />
              </div>
            ))
          )}
        </div>
        <div className="button-group">
          <button type="button" className="submit-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal; 