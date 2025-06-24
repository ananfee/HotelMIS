package bla.bla.elevate_app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;  // добавляем импорт
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "amenity")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amenity_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "amenities")
    @JsonBackReference  // добавляем сюда
    private List<Room> rooms;
}
