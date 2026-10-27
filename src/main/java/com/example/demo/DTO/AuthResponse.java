package com.example.demo.DTO;

public record AuthResponse(String token, String role, Long id, String name) {
}
