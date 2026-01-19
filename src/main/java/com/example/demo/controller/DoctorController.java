package com.example.demo.controller;


import com.example.demo.model.Doctor;
import com.example.demo.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    };

    @GetMapping
    public List<Doctor> findAllDoctors() {
        return doctorService.findAllDoctors();
    }

    @GetMapping
    public List<Doctor> findAllDoctorsByProfession(String profession) {
        return doctorService.findAllDoctorsByProfession(profession);
    }

    @PostMapping("/{id}")
    public Doctor findDoctorById(@PathVariable Long id) {
        return doctorService.findDoctorById(id);
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }

}
