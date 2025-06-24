package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.Discount;

public interface DiscountRepository 
    extends JpaRepository<Discount, Integer> {

}