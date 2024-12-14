import React, { useState, useEffect } from 'react';
import { ref, onValue, off, update } from 'firebase/database';
import { database } from '../config/firebase-config';
import './PublicEvents.css';

const PublicEvents = ({ isOpen, onClose, userEmail }) => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('none'); // 'none', 'interests', 'alphabetical'
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const publicEvents = Object.entries(data)
          .filter(([_, event]) => event.isPublic)
          .map(([id, event]) => ({
            id,
            ...event,
            isUserInterested: Array.isArray(event.interestedEmails) && 
                             event.interestedEmails.includes(userEmail)
          }));
        setEvents(publicEvents);
      }
    });

    return () => {
      const eventsRef = ref(database, 'events');
      off(eventsRef);
    };
  }, [userEmail]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSort = () => {
    if (sortType === 'none') {
      setSortType('interests');
      setSortDirection('desc');
    } else if (sortType === 'interests') {
      setSortType('alphabetical');
      setSortDirection('asc');
    } else {
      setSortType('none');
      setSortDirection('asc');
    }
  };

  const getSortIcon = () => {
    switch (sortType) {
      case 'interests':
        return sortDirection === 'asc' ? '👥↑' : '👥↓';
      case 'alphabetical':
        return sortDirection === 'asc' ? 'A↑' : 'A↓';
      default:
        return '↕️';
    }
  };

  const sortEvents = (eventsToSort) => {
    switch (sortType) {
      case 'interests':
        return [...eventsToSort].sort((a, b) => {
          const diff = (b.interested || 0) - (a.interested || 0);
          return sortDirection === 'asc' ? -diff : diff;
        });
      case 'alphabetical':
        return [...eventsToSort].sort((a, b) => {
          const diff = a.title.localeCompare(b.title);
          return sortDirection === 'asc' ? diff : -diff;
        });
      default:
        return eventsToSort;
    }
  };

  const filteredAndSortedEvents = sortEvents(
    events.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm)
    )
  );

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
        
        <div className="public-events-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="public-events-search"
            />
            <button 
              onClick={handleSort}
              className="sort-button"
              title={`Sort by: ${sortType === 'none' ? 'None' : sortType}`}
            >
              {getSortIcon()}
            </button>
          </div>
        </div>

        <div className="public-events-container">
          {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map(event => (
              <div key={event.id} className="public-event-card">
                <div className="public-event-image">
                  <img
                    src={event.imageUrl || "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwAAAA?rs=1&pid=ImgDetMain"}
                    alt={event.title}
                    onError={e => e.target.src = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwAAAA?rs=1&pid=ImgDetMain"}
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
                      {event.isUserInterested ? 'Remove Interest' : 'Interested'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="public-empty-state">No public events found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicEvents; 