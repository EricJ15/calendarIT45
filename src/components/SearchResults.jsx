import React from 'react';
import './EventModal.css';

const SearchResults = ({ isOpen, onClose, searchResults, onEventClick }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Search Results</h2>
        <div className="schedule-list">
          {searchResults.length === 0 ? (
            <p>No matching events found</p>
          ) : (
            searchResults.map(event => (
              <div 
                key={event.id} 
                className="schedule-item search-item" 
                onClick={() => onEventClick(event)}
                style={{ cursor: 'pointer' }}
              >
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

export default SearchResults; 