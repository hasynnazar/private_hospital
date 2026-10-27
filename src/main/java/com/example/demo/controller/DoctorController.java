package com.example.demo.controller;

import com.example.demo.DTO.DoctorDTO;
import com.example.demo.model.Doctor;
import com.example.demo.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public List<DoctorDTO> findAllDoctors() {
        return doctorService.findAllDoctors();
    }


    @GetMapping("/by-profession")
    public List<DoctorDTO> findAllDoctorsByProfession(@RequestParam String profession) {
        return doctorService.findAllDoctorsByProfession(profession);
    }


    @GetMapping("/{id}")
    public DoctorDTO findDoctorById(@PathVariable Long id) {
        return doctorService.findDoctorById(id);
    }


    @PostMapping
    public DoctorDTO createDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }
}