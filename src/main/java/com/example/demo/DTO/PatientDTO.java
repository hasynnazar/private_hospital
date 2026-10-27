package com.example.demo.DTO;

import lombok.Data;

    @Data
    public class PatientDTO {
        private Long id;
        private String name;
        private String surname;
        private String email;
        private String phone;
    }

