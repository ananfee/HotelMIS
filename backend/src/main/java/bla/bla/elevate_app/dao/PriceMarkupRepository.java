package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.PriceMarkup;

public interface PriceMarkupRepository 
    extends JpaRepository<PriceMarkup, Integer> {

}
