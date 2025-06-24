import React from 'react';
import './BookingCard.css';
import { ReactComponent as EditIcon } from '../icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../icons/Delete.svg';

const BookingCard = ({ booking, onCheckInClick }) => {
  const { room, plannedCheckInDate, plannedCheckOutDate, status, guest } = booking;

  const normalizeImagePath = (path) => {
    if (!path) return '';
    const parts = path.split('\\');
    return `/images/${parts[parts.length - 1]}`;
  };

  // Получаем текущую дату в формате YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

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
          <span>{plannedCheckInDate} - {plannedCheckOutDate}</span>
        </div>
      </div>

      <div className="room-content">
        <div className="room-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3>Бронирование</h3>
          <span style={{
            padding: '4px 8px',
            borderRadius: '5px',
            backgroundColor: '#F5F5F7',
            color: '#000',
            fontSize: '0.8em'
          }}>
            {status}
          </span>
        </div>

        <div className="booking-info-text">
          <p className="margin-none">{guest.firstName} {guest.lastName}</p>
        </div>

        <div className="booking-info-text">
          <p className="margin-none">{guest.phoneNumber}</p>
        </div>

        <div className="room-buttons">
          <button
            className="primary-btn"
            onClick={() => {
              if (plannedCheckInDate > today) {
                alert('Нельзя заселить гостей до даты заезда.');
                return;
              }
              onCheckInClick(booking);
            }}
          >
            Заселить
          </button>

          <button className="icon-button" onClick={() => console.log('edit')}>
            <EditIcon />
          </button>

          <button className="icon-button" onClick={() => console.log('delete')}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
