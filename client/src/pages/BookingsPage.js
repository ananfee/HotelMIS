import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
import BookingCard from '../components/BookingCard';
import EmptyCheckInModal from '../modals/EmptyCheckInModal';

const ROOMS_PER_PAGE = 8;

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings');
        const data = await response.json();

        const bookingPromises = data._embedded.bookings.map(async booking => {
          const [roomRes, guestRes, statusRes] = await Promise.all([
            fetch(booking._links.room.href).then(res => res.json()),
            fetch(booking._links.guest.href).then(res => res.json()),
            fetch(booking._links.bookingStatus.href).then(res => res.json()),
          ]);

          return {
            id: booking._links.self.href.split('/').pop(),
            plannedCheckInDate: booking.plannedCheckInDate,
            plannedCheckOutDate: booking.plannedCheckOutDate,
            childBed: booking.childBed,
            room: roomRes,
            guest: guestRes,
            status: statusRes.name,
            fullBooking: booking
          };
        });

        const bookingsWithDetails = await Promise.all(bookingPromises);

// Сортировка по дате создания (по убыванию — новые первыми)
bookingsWithDetails.sort((a, b) => new Date(b.fullBooking.createdAt) - new Date(a.fullBooking.createdAt));

const filteredBookings = bookingsWithDetails.filter(b => b.status === "Подтверждено");

        setBookings(filteredBookings);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchBookings();
  }, []);

  const indexOfLastRoom = currentPage * ROOMS_PER_PAGE;
  const indexOfFirstRoom = indexOfLastRoom - ROOMS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(bookings.length / ROOMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenCheckIn = (booking) => {
    setSelectedBooking(booking);
    setIsCheckInModalOpen(true);
  };

  const handleCloseCheckInModal = () => {
    setSelectedBooking(null);
    setIsCheckInModalOpen(false);
  };

  return (
    <div style={{ padding: '20px 20px 0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Search />
      </div>

      <div className="rooms-list">
      {currentBookings.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '18px' }}>
          Бронирований нет
        </p>
      ) : (
        currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCheckInClick={() => handleOpenCheckIn(booking)}
          />
        ))
      )}
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

      {isCheckInModalOpen && (
        <EmptyCheckInModal
          isOpen={isCheckInModalOpen}
          onClose={handleCloseCheckInModal}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BookingsPage;
