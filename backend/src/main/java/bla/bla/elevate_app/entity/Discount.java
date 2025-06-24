package bla.bla.elevate_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "discount_id")
    private Integer id;

    @Column(name = "min_days", nullable = false, unique = true)
    private Integer minDays;

    @Column(name = "discount_percent", nullable = false)
    private Double discountPercent;
}
