package com.example.demo.service;

import com.example.demo.DTO.AppointmentDTO;
import com.example.demo.DTO.AppointmentRequest;
import com.example.demo.security.AuthUser;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    AppointmentDTO bookAppointment(Long patientId, AppointmentRequest request);

    AppointmentDTO cancelAppointment(Long id, AuthUser user);

    AppointmentDTO findById(Long id, AuthUser user);

    /** Wizyty zalogowanego pacjenta albo grafik zalogowanego lekarza. */
    List<AppointmentDTO> findMy(AuthUser user);

    List<AppointmentDTO> findAll();

    List<LocalDateTime> findFreeSlots(Long doctorId, LocalDate date);

    void completePastAppointments();
}
