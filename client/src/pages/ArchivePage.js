import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
import BookingCard from '../components/Archive';

const ROOMS_PER_PAGE = 8;

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
          };
        });

        const bookingsWithDetails = await Promise.all(bookingPromises);

        // Фильтрация по статусам "Отмена" и "Неявка"
        const filteredBookings = bookingsWithDetails.filter(
          booking =>
            booking.status === "Отмена" ||
            booking.status === "Неявка"
        );

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ padding: '20px 20px 0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Search />
      </div>

      <div className="rooms-list">
        {currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            room={{
              roomNumber: booking.room.roomNumber,
              imagePath: booking.room.imagePath,
              checkindate: booking.plannedCheckInDate,
              checkoutdate: booking.plannedCheckOutDate,
              status: booking.status,
              guest: `${booking.guest.firstName} ${booking.guest.lastName}`,
              numberphone: booking.guest.phoneNumber,
            }}
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
    </div>
  );
};

export default BookingsPage;
