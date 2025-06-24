package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.BookingStatus;

public interface BookingStatusRepository 
    extends JpaRepository<BookingStatus, Integer> {

}
