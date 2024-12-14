import React from 'react';
import './EventModal.css';

const ScheduleModal = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content schedule-modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>My Schedules</h2>
        <div className="schedule-list">
          {events
            .filter(event => event.email === localStorage.getItem('userEmail'))
            .sort((a, b) => new Date(b.start) - new Date(a.start))
            .map((event) => (
              <div key={event.id} className="schedule-item">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {new Date(event.start).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Location:</strong> {event.location}</p>
                {event.isPublic && (
                  <>
                    <p><strong>Event Type:</strong> Public</p>
                    <p><strong>Interested:</strong> {event.interested}</p>
                  </>
                )}
                <hr />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal; 