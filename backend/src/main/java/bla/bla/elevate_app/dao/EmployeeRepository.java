package bla.bla.elevate_app.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import bla.bla.elevate_app.entity.Employee;

public interface EmployeeRepository 
    extends JpaRepository<Employee, Integer> {

}
