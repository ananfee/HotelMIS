package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.CheckInStatus;

public interface CheckInStatusRepository 
    extends JpaRepository<CheckInStatus, Integer> {

}
