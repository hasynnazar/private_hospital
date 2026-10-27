package com.example.demo.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String password;
}
