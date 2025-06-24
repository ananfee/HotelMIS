package bla.bla.elevate_app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "guest")
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_id")
    private Integer id;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "document_number", nullable = false)
    private String documentNumber;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "document_type_id", nullable = false)
    private DocumentType documentType;

    @OneToMany(mappedBy = "guest")
    @JsonIgnore
    private List<Booking> bookings;

    @ManyToMany(mappedBy = "guests")
    @JsonIgnore
    private List<CheckIn> checkIns;

}
