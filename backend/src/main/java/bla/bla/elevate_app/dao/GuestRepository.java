package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import java.util.List;
import bla.bla.elevate_app.entity.Guest;

public interface GuestRepository extends JpaRepository<Guest, Integer> {

    @RestResource(path = "findByPhoneNumber", rel = "findByPhoneNumber")
    List<Guest> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}

