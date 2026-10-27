package com.example.demo.service;

import com.example.demo.DTO.PatientDTO;
import com.example.demo.exception.ConflictException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientServiceImpl(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<PatientDTO> findAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO findPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Pacjent z id " + id + " nie istnieje"));
    }

    @Override
    public PatientDTO findPatientByEmail(String email) {
        return patientRepository.findByEmail(email)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Pacjent z emailem " + email + " nie istnieje"));
    }

    @Override
    public PatientDTO savePatient(Patient patient) {
        if (patient.getEmail() == null || patient.getEmail().isBlank()
                || patient.getPassword() == null || patient.getPassword().length() < 6) {
            throw new IllegalArgumentException("Email oraz hasło (min. 6 znaków) są wymagane");
        }
        String email = patient.getEmail().trim().toLowerCase();
        if (patientRepository.existsByEmail(email)) {
            throw new ConflictException("Konto z takim adresem email już istnieje");
        }
        patient.setEmail(email);
        patient.setLogin(email);
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        Patient savedPatient = patientRepository.save(patient);
        return convertToDto(savedPatient);
    }

    @Override
    public PatientDTO updatePatient(Long id, Patient details) {
        return patientRepository.findById(id).map(patient -> {

            patient.setName(details.getName());
            patient.setSurname(details.getSurname());
            patient.setEmail(details.getEmail());
            patient.setPhone(details.getPhone());


            if (details.getPassword() != null && !details.getPassword().isEmpty()) {
                patient.setPassword(passwordEncoder.encode(details.getPassword()));
            }

            return convertToDto(patientRepository.save(patient));
        }).orElseThrow(() -> new ResourceNotFoundException("Pacjent z id " + id + " nie istnieje"));
    }
    @Override
    public void deletePatientById(Long id){
        if(!patientRepository.existsById(id)){
            throw new ResourceNotFoundException("Nie można usunąć, pacjent z id " + id + " nie istnieje");
        }
        patientRepository.deleteById(id);
    }
    @Override
    public boolean existsPatientByEmail(String email){
        return patientRepository.existsByEmail(email);
    }


    private PatientDTO convertToDto(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setSurname(patient.getSurname());
        dto.setEmail(patient.getEmail());
        dto.setPhone(patient.getPhone());
        return dto;
    }
}
