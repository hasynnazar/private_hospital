package com.example.demo.service;

import com.example.demo.DTO.DoctorDTO;
import com.example.demo.model.Doctor;
import com.example.demo.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // 1. Отримуємо всіх лікарів вже як DTO
    @Override
    public List<DoctorDTO> findAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 2. Пошук одного лікаря теж повертає DTO
    @Override
    public DoctorDTO findDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::convertToDto)
                .orElse(null);
    }

    // 3. Пошук за професією — теж DTO
    @Override
    public List<DoctorDTO> findAllDoctorsByProfession(String profession) {
        return doctorRepository.findByProfession(profession).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 4. Зберігання: приймаємо Entity (або DTO), повертаємо DTO
    @Override
    public DoctorDTO saveDoctor(Doctor doctor) {
        Doctor savedDoctor = doctorRepository.save(doctor);
        return convertToDto(savedDoctor);
    }

    // МАПЕР (службовий метод для перетворення)
    private DoctorDTO convertToDto(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setSurname(doctor.getSurname());
        dto.setProfession(doctor.getProfession());
        dto.setEmail(doctor.getEmail());
        dto.setPhone(doctor.getPhone());
        return dto;
    }
}