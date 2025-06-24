package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.CheckIn;

public interface CheckInRepository 
    extends JpaRepository<CheckIn, Integer> {

}
