package bla.bla.elevate_app.dao;

import bla.bla.elevate_app.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query(value = """
        SELECT r.*
        FROM room r
        LEFT JOIN check_in c 
          ON c.room_id = r.room_id 
          AND c.planned_check_in_date < :checkOut 
          AND c.planned_check_out_date > :checkIn
        LEFT JOIN booking b 
          ON b.room_id = r.room_id 
          AND b.planned_check_in_date < :checkOut 
          AND b.planned_check_out_date > :checkIn
        WHERE r.capacity >= :guests
          AND c.check_in_id IS NULL
          AND b.booking_id IS NULL
        """, nativeQuery = true)
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut,
        @Param("guests") int guests
    );
    @Query(value = "CALL calculate_room_price(:p_room_id, :p_start_date, :p_end_date)", nativeQuery = true)
    BigDecimal calculateRoomPrice(
    @Param("p_room_id") Integer roomId,
    @Param("p_start_date") LocalDate startDate,
    @Param("p_end_date") LocalDate endDate
);

}
