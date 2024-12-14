import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../config/firebase-config';
import './PublicEvents.css';

const PublicEvents = ({ isOpen, onClose, userEmail }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DEFAULT_IMAGE = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwAAAA?rs=1&pid=ImgDetMain";

  useEffect(() => {
    if (!isOpen) return;

    const eventsRef = ref(database, 'events');
    setLoading(true);
    setError(null);

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const eventsData = snapshot.val();
          const eventsList = Object.entries(eventsData)
            .map(([id, data]) => ({
              id,
              ...data,
              isUserInterested: Array.isArray(data.interestedEmails) && 
                data.interestedEmails.includes(userEmail)
            }))
            .filter(event => event.isPublic === true)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setEvents(eventsList);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isOpen, userEmail]);

  const handleInterested = async (event) => {
    if (!userEmail) {
      alert('Please log in to mark your interest');
      return;
    }

    try {
      const eventRef = ref(database, `events/${event.id}`);
      const currentInterestedEmails = Array.isArray(event.interestedEmails) ? event.interestedEmails : [];
      const newInterestedCount = event.isUserInterested 
        ? Math.max(0, (event.interested || 0) - 1)
        : (event.interested || 0) + 1;

      const updatedInterestedEmails = event.isUserInterested
        ? currentInterestedEmails.filter(email => email !== userEmail)
        : [...currentInterestedEmails, userEmail];

      await update(eventRef, {
        interestedEmails: updatedInterestedEmails,
        interested: newInterestedCount
      });
    } catch (error) {
      console.error("Error updating interest:", error);
      alert('Failed to update interest. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="public-modal-overlay" onClick={onClose}>
      <div className="public-modal-content" onClick={e => e.stopPropagation()}>
        <button className="public-modal-close" onClick={onClose}>&times;</button>
        <h2>Public Events</h2>

        {loading && (
          <div className="public-loading-state">
            <p>Loading events...</p>
          </div>
        )}

        {error && (
          <div className="public-error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="public-empty-state">
            <p>No public events available at the moment.</p>
          </div>
        )}
        
        {!loading && !error && events.length > 0 && (
          <div className="public-events-container">
            {events.map(event => (
              <div key={event.id} className="public-event-card">
                <div className="public-event-image">
                  <img
                    src={event.imageUrl || DEFAULT_IMAGE}
                    alt={event.title}
                    onError={e => e.target.src = DEFAULT_IMAGE}
                  />
                </div>
                <div className="public-event-info">
                  <h3>{event.title}</h3>
                  <p className="public-event-description">{event.description}</p>
                  <p className="public-event-date">Date: {event.date}</p>
                  <div className="public-event-stats">
                    <span>{event.interested || 0} interested</span>
                    <button
                      className={`public-interest-button ${event.isUserInterested ? 'interested' : ''}`}
                      onClick={() => handleInterested(event)}
                    >
                      {event.isUserInterested ? 'Not Interested' : 'Interested'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEvents; 