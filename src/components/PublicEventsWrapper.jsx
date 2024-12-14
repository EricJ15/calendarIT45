import React from 'react';
import PublicEvents from './PublicEvents';

const PublicEventsWrapper = ({ isOpen, onClose, userEmail }) => {
  return (
    <PublicEvents
      isOpen={isOpen}
      onClose={onClose}
      userEmail={userEmail}
    />
  );
};

export default PublicEventsWrapper;