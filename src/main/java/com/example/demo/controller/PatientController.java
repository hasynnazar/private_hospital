package com.example.demo.controller;

import com.example.demo.DTO.PatientDTO;
import com.example.demo.model.Patient;
import com.example.demo.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {
    private final PatientService patientService;

    @GetMapping
    public List<PatientDTO> findAllPatients() {
        return patientService.findAllPatients();
    }

    @GetMapping("/{id}")
    public PatientDTO findPatientById(@PathVariable Long id) {
        return patientService.findPatientById(id);
    }

    @GetMapping("/by-email")
    public PatientDTO findPatientByEmail(@RequestParam String email) {
        return patientService.findPatientByEmail(email);
    }

    @GetMapping("/exists")
    public boolean existsPatientByEmail(@RequestParam String email) {
        return patientService.existsPatientByEmail(email);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientDTO createPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping("/{id}")
    public PatientDTO updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePatient(@PathVariable Long id) {
        patientService.deletePatientById(id);
    }
}
