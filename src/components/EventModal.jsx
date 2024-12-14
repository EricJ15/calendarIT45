import React, { useState, useEffect } from 'react';
import './EventModal.css';

const DEFAULT_IMAGE_URL = 'https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwAAAA?rs=1&pid=ImgDetMain';

const EventModal = ({ isOpen, onClose, event, onSave, onUpdate, onDelete, mode, setModalMode, setModalOpen }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [interested, setInterested] = useState(1);
  const [interestedEmails, setInterestedEmails] = useState([]);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDate(event.date || '');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setIsPublic(event.isPublic || false);
      setImageUrl(event.imageUrl || '');
      setInterested(event.interested || 1);
      setInterestedEmails(event.interestedEmails || []);
    } else {
      setTitle('');
      setDate('');
      setDescription('');
      setLocation('');
      setIsPublic(false);
      setImageUrl('');
      setInterested(1);
      setInterestedEmails([]);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title,
      date,
      description,
      location,
      isPublic,
      imageUrl: isPublic ? imageUrl : '',
      interested: isPublic ? interested : 1,
      interestedEmails: isPublic ? interestedEmails : []
    };

    if (event?.id) {
      onUpdate({ ...eventData, id: event.id });
    } else {
      onSave(eventData);
    }
    onClose();
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE_URL;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === 'create' ? 'Create Event' : mode === 'edit' ? 'Edit Event' : 'View Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={mode === 'view'}
              required
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={mode === 'view'}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={mode === 'view'}
              required
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={mode === 'view'}
              required
            />
          </div>
          <div className="form-group">
            <label>Event Type:</label>
            <select
              value={isPublic ? 'public' : 'private'}
              onChange={(e) => setIsPublic(e.target.value === 'public')}
              disabled={mode === 'view'}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          {isPublic && (
            <>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group">
                <img
                  src={imageUrl || DEFAULT_IMAGE_URL}
                  alt="Event"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  onError={handleImageError}
                />
              </div>
            </>
          )}
          {isPublic && mode === 'view' && (
            <div className="form-group">
              <label className="disabled">Interested Users: {interested}</label>
              <div className="interested-list disabled">
                {interestedEmails.map((email, index) => (
                  <div key={index} className="interested-email disabled">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="button-container">
            {mode !== 'view' && (
              <button type="submit" className="modal-button save-button">
                {mode === 'create' ? 'Create' : 'Update'}
              </button>
            )}
            {mode === 'view' && event && (
              <>
                <button 
                  type="button" 
                  onClick={() => onDelete(event.id)} 
                  className="modal-button delete-button"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setModalMode('edit');
                    setModalOpen(true);
                  }}
                  className="modal-button edit-button"
                >
                  Edit
                </button>
              </>
            )}
            <button type="button" onClick={onClose} className="modal-button close-button">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 