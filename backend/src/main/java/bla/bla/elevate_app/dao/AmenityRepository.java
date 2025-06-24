package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.Amenity;

public interface AmenityRepository 
    extends JpaRepository<Amenity, Integer> {

}
