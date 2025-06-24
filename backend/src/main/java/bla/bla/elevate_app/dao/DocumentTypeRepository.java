package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.DocumentType;

public interface DocumentTypeRepository 
    extends JpaRepository<DocumentType, Integer> {

}
