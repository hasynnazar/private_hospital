package com.example.demo.DTO;

import com.example.demo.model.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private LocalDateTime dateTime;
    private AppointmentStatus status;
    private Long doctorId;
    private String doctorName;
    private String doctorProfession;
    private Long patientId;
    private String patientName;
    private String patientPhone;
}
