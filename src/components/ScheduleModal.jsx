import React from 'react';
import './EventModal.css';

const ScheduleModal = ({ isOpen, onClose, events }) => {
  const userEmail = localStorage.getItem('userEmail');
  
  // Filter events into owned and interested categories
  const ownedEvents = events.filter(event => event.email === userEmail);
  const interestedEvents = events.filter(event => 
    event.email !== userEmail && 
    event.interestedEmails?.includes(userEmail)
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="schedules-container">
          <h2>My Events</h2>
          {ownedEvents.length > 0 ? (
            <div className="events-list">
              {ownedEvents.map(event => (
                <div key={event.id} className="event-item">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.start}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  {event.isPublic && (
                    <p><strong>Interested:</strong> {event.interested || 0}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No events created yet.</p>
          )}

          <h2 className="interested-section">Events I'm Interested In</h2>
          {interestedEvents.length > 0 ? (
            <div className="events-list">
              {interestedEvents.map(event => (
                <div key={event.id} className="event-item interested">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.start}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Interested:</strong> {event.interested || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No events marked as interested.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal; 