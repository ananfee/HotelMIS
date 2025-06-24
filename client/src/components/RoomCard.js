import React, { useState, useEffect } from 'react';
import './RoomCard.css';
import guestIcon from '../icons/guests.svg';
import wifiIcon from '../icons/wifi.svg';
import barIcon from '../icons/bar.svg';
import tvIcon from '../icons/tv.svg';
import eatIcon from '../icons/eat.svg';
import petIcon from '../icons/pet.svg';

const amenityIcons = {
  1: wifiIcon,
  2: barIcon,
  3: tvIcon,
  4: eatIcon,
  5: petIcon
};

const RoomCard = ({ room, disableActions, onBookClick, onCheckInClick }) => {
  const [roomTypeName, setRoomTypeName] = useState('');
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    if (room._links?.roomType?.href) {
      fetch(room._links.roomType.href)
        .then(res => {
          if (!res.ok) throw new Error('Ошибка загрузки типа');
          return res.json();
        })
        .then(data => setRoomTypeName(data.name || 'Неизвестно'))
        .catch(() => setRoomTypeName('Неизвестно'));
    }

    if (room._links?.amenities?.href) {
      fetch(room._links.amenities.href)
        .then(res => {
          if (!res.ok) throw new Error('Ошибка загрузки удобств');
          return res.json();
        })
        .then(data => {
          if (data._embedded && data._embedded.amenities) {
            setAmenities(data._embedded.amenities);
          } else {
            setAmenities([]);
          }
        })
        .catch(() => setAmenities([]));
    }
  }, [room]);

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
          <span>Номер {room.roomNumber}</span>
          <span>{room.pricePerNight} ₽ / ночь</span>
        </div>
      </div>

      <div className="room-content">
        <div className="room-header">
          <h3>{roomTypeName || 'Загрузка типа...'}</h3>
        </div>

        <div className="room-amenities">
          <div className="amenity amenity-guests">
            <img src={guestIcon} alt="Гости" />
            <span>{room.capacity}</span>
          </div>
          {amenities && Array.isArray(amenities) && amenities.map((amenity, index) => {
            const href = amenity._links?.self?.href || '';
            const idMatch = href.match(/\/amenities\/(\d+)$/);
            const id = idMatch ? Number(idMatch[1]) : null;

            if (!id) return null;

            const icon = amenityIcons[id] || wifiIcon;

            return (
              <div className="amenity" key={`${id}-${amenity.name}-${index}`}>
                <img
                  src={icon}
                  alt={amenity.name}
                  title={amenity.name}
                />
              </div>
            );
          })}
        </div>

        <div className="room-buttons">
          <button 
            className="primary-btn" 
            disabled={disableActions}
            onClick={() => onBookClick(room)}
          >
            Забронировать
          </button>
          <button 
            className="secondary-btn" 
            disabled={disableActions}
            onClick={() => onCheckInClick(room)}
          >
            Заселить
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;



