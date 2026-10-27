package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByDateTimeDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByDateTimeAsc(Long doctorId);

    boolean existsByDoctorIdAndDateTimeAndStatus(Long doctorId, LocalDateTime dateTime, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndDateTimeBetweenAndStatus(Long doctorId, LocalDateTime from,
                                                                LocalDateTime to, AppointmentStatus status);

    List<Appointment> findByStatusAndDateTimeBefore(AppointmentStatus status, LocalDateTime dateTime);
}
