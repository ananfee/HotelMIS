package bla.bla.elevate_app.controllers;

import bla.bla.elevate_app.entity.RoomType;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "idName", types = { RoomType.class })
public interface RoomTypeIdNameProjection {
    Integer getId();
    String getName();
}
