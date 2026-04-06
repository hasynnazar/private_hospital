package com.example.demo.DTO;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String name;
    private String surname;
    private String profession;
    private String email;
    private String phone;
}