package com.example.demo.service;

import com.example.demo.DTO.DoctorDTO;
import com.example.demo.exception.ConflictException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Doctor;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImpl(DoctorRepository doctorRepository,
                             PatientRepository patientRepository,
                             PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public List<DoctorDTO> findAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    @Override
    public DoctorDTO findDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Lekarz z id " + id + " nie istnieje"));
    }


    @Override
    public List<DoctorDTO> findAllDoctorsByProfession(String profession) {
        return doctorRepository.findByProfession(profession).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    @Override
    public DoctorDTO saveDoctor(Doctor doctor) {
        if (doctor.getEmail() == null || doctor.getEmail().isBlank()
                || doctor.getPassword() == null || doctor.getPassword().length() < 6) {
            throw new IllegalArgumentException("Email oraz hasło (min. 6 znaków) są wymagane");
        }
        String email = doctor.getEmail().trim().toLowerCase();
        if (doctorRepository.findByEmail(email).isPresent() || patientRepository.existsByEmail(email)) {
            throw new ConflictException("Konto z takim adresem email już istnieje");
        }
        doctor.setEmail(email);
        doctor.setLogin(email);
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        Doctor savedDoctor = doctorRepository.save(doctor);
        return convertToDto(savedDoctor);
    }


    private DoctorDTO convertToDto(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setSurname(doctor.getSurname());
        dto.setProfession(doctor.getProfession());
        dto.setEmail(doctor.getEmail());
        dto.setPhone(doctor.getPhone());
        dto.setImageUrl(doctor.getImageUrl());
        return dto;
    }
}