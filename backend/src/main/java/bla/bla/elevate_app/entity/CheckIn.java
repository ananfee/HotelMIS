package bla.bla.elevate_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "check_in")
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "check_in_id")
    private Integer id;

    @Column(name = "actual_check_in_date", nullable = false)
    private LocalDate actualCheckInDate;

    @Column(name = "actual_check_out_date")
    private LocalDate actualCheckOutDate;

    @Column(name = "planned_check_in_date", nullable = false)
    private LocalDate plannedCheckInDate;

    @Column(name = "planned_check_out_date", nullable = false)
    private LocalDate plannedCheckOutDate;

    @Column(name = "child_bed", nullable = false)
    private Boolean childBed;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    @ManyToMany
    @JoinTable(
        name = "guest_check_in",
        joinColumns = @JoinColumn(name = "check_in_id"),
        inverseJoinColumns = @JoinColumn(name = "guest_id")
    )
    private List<Guest> guests;


    @ManyToOne
    @JoinColumn(
        name = "status_id",
        referencedColumnName = "status_id",
        foreignKey = @ForeignKey(name = "fk_check_in_status")
    )
    private CheckInStatus status;

}

