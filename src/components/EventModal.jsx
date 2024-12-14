import React, { useState } from 'react';
import './EventModal.css';

const EventModal = ({ isOpen, onClose, event, onSave, onUpdate, onDelete, mode, setModalMode, setModalOpen }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || '');
  const [isPublic, setIsPublic] = useState(event?.isPublic || false);
  const [eventType, setEventType] = useState('private');

  const isOwner = event ? event.email === localStorage.getItem('userEmail') : true;

  console.log('Event email:', event?.email);
  console.log('User email:', localStorage.getItem('userEmail'));
  console.log('Is owner?', isOwner);

  React.useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setDescription(event.description);
      setLocation(event.location);
      setImageUrl(event.imageUrl);
      setIsPublic(event.isPublic);
      setEventType(event.isPublic ? 'public' : 'private');
    } else {
      setTitle('');
      setDate('');
      setDescription('');
      setLocation('');
      setImageUrl('');
      setIsPublic(false);
      setEventType('private');
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title,
      date,
      description,
      location,
      imageUrl: eventType === 'public' ? imageUrl : '',
      isPublic: eventType === 'public'
    };

    if (mode === 'create') {
      onSave(eventData);
    } else if (mode === 'edit' && event?.id) {
      onUpdate({ ...eventData, id: event.id });
    }
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const renderViewMode = () => (
    <div className="event-details">
      <h2>{title}</h2>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Location:</strong> {location}</p>
      {imageUrl && (
        <div className="event-image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      {event?.isPublic && (
        <p><strong>Interested Users:</strong> {event.interested || 0}</p>
      )}
      {isOwner && (
        <div className="button-group">
          <button onClick={() => setModalMode('edit')}>Edit</button>
          <button className="delete-button" onClick={() => onDelete(event.id)}>Delete</button>
        </div>
      )}
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <select 
        value={eventType} 
        onChange={(e) => setEventType(e.target.value)}
        className="event-type-select"
      >
        <option value="private">Private Event</option>
        <option value="public">Public Event</option>
      </select>
      
      {eventType === 'public' && (
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      )}
      
      <div className="button-group">
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {mode === 'view' && (
          <button className="modal-close" onClick={onClose}>&times;</button>
        )}
        {mode === 'view' ? renderViewMode() : 
         mode === 'create' || (mode === 'edit' && isOwner) ? renderEditMode() : 
         renderViewMode()}
      </div>
    </div>
  );
};

export default EventModal; 