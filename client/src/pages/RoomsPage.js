import React, { useState, useEffect } from 'react';
import Filter from '../components/Filter';
import RoomCard from '../components/RoomCard';
import BookingModal from '../modals/BookingModal';
import CheckInModal from '../modals/CheckInModal'; // Добавляем импорт
import './RoomsPage.css';

const ROOMS_PER_PAGE = 8;

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false); // Новое состояние

  const fetchAllRooms = () => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:8080/api/rooms')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then(data => {
        if (data._embedded && data._embedded.rooms) {
          setRooms(data._embedded.rooms);
        } else if (Array.isArray(data)) {
          setRooms(data);
        } else {
          setRooms([]);
        }
        setLoading(false);
        setCurrentPage(1);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAvailableRooms = ({ checkIn, checkOut, guests }) => {
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setGuests(guests);

    if (!checkIn || !checkOut || !guests) {
      fetchAllRooms();
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const checkInStr = checkIn.toISOString().split('T')[0];
    const checkOutStr = checkOut.toISOString().split('T')[0];

    fetch(`http://localhost:8080/api/rooms/available?checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guests}`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleCheckInClick = (room) => {
    setSelectedRoom(room);
    setIsCheckInModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
  };

  const handleCloseCheckInModal = () => {
    setIsCheckInModalOpen(false);
    setSelectedRoom(null);
  };

  const indexOfLastRoom = currentPage * ROOMS_PER_PAGE;
  const indexOfFirstRoom = indexOfLastRoom - ROOMS_PER_PAGE;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const disableActions = !checkIn || !checkOut || !guests;

  return (
    <main className="app-content">
      <div className="filter-wrapper">
        <Filter onFilter={fetchAvailableRooms} />
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}

      {!loading && !error && rooms.length === 0 && (
        <p>Нет доступных номеров по выбранным параметрам</p>
      )}

      <div className="rooms-list">
        {currentRooms.map(room => (
          <RoomCard 
            key={room.id} 
            room={room} 
            disableActions={disableActions} 
            onBookClick={handleBookClick}
            onCheckInClick={handleCheckInClick} // Передаем новый обработчик
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-button ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={handleCloseBookingModal} 
        room={selectedRoom} 
        checkIn={checkIn} 
        checkOut={checkOut} 
        guests={guests} 
      />

      <CheckInModal 
      isOpen={isCheckInModalOpen}
      onClose={handleCloseCheckInModal}
      room={selectedRoom}
      checkIn={checkIn}
      checkOut={checkOut}
      guests={guests}
    />

    </main>
  );
}

export default RoomsPage;





