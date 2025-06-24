package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.Booking;

public interface BookingRepository 
    extends JpaRepository<Booking, Integer> {

}
