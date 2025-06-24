package bla.bla.elevate_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "price_markup")
public class PriceMarkup {

    @Id
    @Column(name = "day_of_week")
    private Integer dayOfWeek;

    @Column(name = "markup_percent", nullable = false)
    private Double markupPercent;
}
