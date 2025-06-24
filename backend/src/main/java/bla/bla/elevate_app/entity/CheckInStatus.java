package bla.bla.elevate_app.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "check_in_status")
public class CheckInStatus {

    @Id
    @Column(name = "status_id")
    private Integer id;

    @Column(name = "status", nullable = false, unique = true)
    private String status;

    // Если хочешь видеть связь с CheckIn, можно сделать OneToMany
    @OneToMany(mappedBy = "status")
    private Set<CheckIn> checkIns;

    // Конструкторы
    public CheckInStatus() {}

    public CheckInStatus(Integer id, String status) {
        this.id = id;
        this.status = status;
    }

    // Геттеры и сеттеры

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<CheckIn> getCheckIns() {
        return checkIns;
    }

    public void setCheckIns(Set<CheckIn> checkIns) {
        this.checkIns = checkIns;
    }
}

