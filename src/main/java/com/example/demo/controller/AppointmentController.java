package com.example.demo.controller;

import com.example.demo.DTO.AppointmentDTO;
import com.example.demo.DTO.AppointmentRequest;
import com.example.demo.security.AuthUser;
import com.example.demo.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    /** Pacjent pochodzi z tokena JWT, nie z treści żądania. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentDTO book(@RequestBody AppointmentRequest request, @AuthenticationPrincipal AuthUser user) {
        return appointmentService.bookAppointment(user.id(), request);
    }

    @GetMapping("/my")
    public List<AppointmentDTO> my(@AuthenticationPrincipal AuthUser user) {
        return appointmentService.findMy(user);
    }

    @GetMapping("/all")
    public List<AppointmentDTO> all() {
        return appointmentService.findAll();
    }

    @GetMapping("/{id}")
    public AppointmentDTO findById(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return appointmentService.findById(id, user);
    }

    @PatchMapping("/{id}/cancel")
    public AppointmentDTO cancel(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return appointmentService.cancelAppointment(id, user);
    }

    @GetMapping("/doctor/{doctorId}/free-slots")
    public List<LocalDateTime> freeSlots(@PathVariable Long doctorId,
                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.findFreeSlots(doctorId, date);
    }
}
