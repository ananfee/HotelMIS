package bla.bla.elevate_app.service;

import bla.bla.elevate_app.dao.RoomRepository;
import bla.bla.elevate_app.entity.Room;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, int guests) {
        return roomRepository.findAvailableRooms(checkIn, checkOut, guests);
    }

    // Добавляем метод для вызова процедуры расчёта цены
    public BigDecimal calculateRoomPrice(Integer roomId, LocalDate startDate, LocalDate endDate) {
        return roomRepository.calculateRoomPrice(roomId, startDate, endDate);
    }
}
