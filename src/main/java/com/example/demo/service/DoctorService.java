package com.example.demo.service;

import com.example.demo.DTO.DoctorDTO;
import com.example.demo.model.Doctor;

import java.util.List;

public interface DoctorService {

    List<DoctorDTO> findAllDoctors();


    DoctorDTO findDoctorById(Long id);


    List<DoctorDTO> findAllDoctorsByProfession(String profession);


    DoctorDTO saveDoctor(Doctor doctor);
}