import React, { useState } from 'react';
import './Archive.css'
import { ReactComponent as EditIcon } from '../icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../icons/Delete.svg';

const BookingCard = ({ room }) => {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleCheckInClick = () => {
    setIsCheckInModalOpen(true);
  };

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseCheckInModal = () => {
    setIsCheckInModalOpen(false);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const normalizeImagePath = (path) => {
    if (!path) return '';
    const parts = path.split('\\');
    return `/images/${parts[parts.length - 1]}`;
  };

  return (
    <div className="room-card">
      <div className="room-image-wrapper">
        <img 
          src={normalizeImagePath(room.imagePath)} 
          className="room-image" 
          alt={`Номер ${room.roomNumber}`} 
        />
        <div className="room-image-overlay">
          <span>{room.roomNumber}</span>
          <span>{room.checkindate} - {room.checkoutdate}</span>
        </div>
      </div>

      <div className="room-content">
     <div className="room-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h3>Бронирование</h3>
        <span
            style={{
            padding: '4px 8px',
            borderRadius: '5px',
            backgroundColor: '#F5F5F7',
            color: '#000',
            fontSize: '0.8em'
            }}
        >
            {room.status}
        </span>
        </div>

        <div className="booking-info-text">
        <p className="margin-none">{room.guest}</p>
        </div>

        <div className="booking-info-text">
        <p className="margin-none">{room.numberphone}</p>
        </div>

        <div className="room-buttons">
        
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
