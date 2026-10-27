package com.example.demo.service;

import com.example.demo.DTO.DoctorDTO;
import com.example.demo.DTO.PatientDTO;
import com.example.demo.model.Doctor;
import com.example.demo.model.Patient;

import java.util.List;

public interface PatientService {
    List<PatientDTO> findAllPatients();
    PatientDTO findPatientById(Long id);
    PatientDTO findPatientByEmail(String email);
    PatientDTO savePatient(Patient patient);
    PatientDTO updatePatient(Long id, Patient details);
    void deletePatientById(Long id);
    boolean existsPatientByEmail(String email);
}
