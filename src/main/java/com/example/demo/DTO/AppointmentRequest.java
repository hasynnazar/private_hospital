package com.example.demo.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private Long doctorId;
    private LocalDateTime dateTime;
}
