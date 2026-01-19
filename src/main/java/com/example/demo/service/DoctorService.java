package com.example.demo.service;

import com.example.demo.model.Doctor;

import java.util.List;

public interface DoctorService {
    List<Doctor> findAllDoctors();
    Doctor findDoctorById(Long id);
    List<Doctor> findAllDoctorsByProfession(String profession);
    Doctor saveDoctor(Doctor doctor);
}
