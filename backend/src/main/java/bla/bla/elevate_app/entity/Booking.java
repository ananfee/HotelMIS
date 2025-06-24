package bla.bla.elevate_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;


@Data
@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer id;

    @Column(name = "planned_check_in_date", nullable = false)
    private LocalDate plannedCheckInDate;

    @Column(name = "planned_check_out_date", nullable = false)
    private LocalDate plannedCheckOutDate;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "child_bed", nullable = false)
    private Boolean childBed;

    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "booking_status_id", nullable = false)
    private BookingStatus bookingStatus;

    @OneToOne(mappedBy = "booking")
    private CheckIn checkIn;
}
