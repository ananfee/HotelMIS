package bla.bla.elevate_app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;  // добавляем импорт
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer id;

    @Column(name = "room_number", nullable = false, unique = true)
    private Integer roomNumber;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "price_per_night", nullable = false)
    private Integer pricePerNight;

    @Column(name = "description", nullable = false, length = 80)
    private String description;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @ManyToMany
    @JoinTable(
        name = "room_amenity",
        joinColumns = @JoinColumn(name = "room_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @JsonManagedReference  // добавляем сюда
    private List<Amenity> amenities;

    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private List<Booking> bookings;

    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private List<CheckIn> checkIns;
}


