package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.RoomType;

public interface RoomTypeRepository 
    extends JpaRepository<RoomType, Integer> {

}

