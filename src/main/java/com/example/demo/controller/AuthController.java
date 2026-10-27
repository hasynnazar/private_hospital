package com.example.demo.controller;

import com.example.demo.DTO.AuthResponse;
import com.example.demo.DTO.LoginRequest;
import com.example.demo.DTO.RegisterRequest;
import com.example.demo.exception.ConflictException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.Doctor;
import com.example.demo.model.Patient;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.security.AuthUser;
import com.example.demo.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String adminEmail;
    private final String adminPassword;

    public AuthController(PatientRepository patientRepository,
                          DoctorRepository doctorRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          @Value("${app.admin.email}") String adminEmail,
                          @Value("${app.admin.password}") String adminPassword) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    /** Rejestracja dotyczy wyłącznie pacjentów. Lekarzy dodaje administrator. */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest req) {
        if (isBlank(req.getName()) || isBlank(req.getSurname()) || isBlank(req.getEmail())
                || isBlank(req.getPhone()) || isBlank(req.getPassword())) {
            throw new IllegalArgumentException("Wszystkie pola są wymagane");
        }
        if (req.getPassword().length() < 6) {
            throw new IllegalArgumentException("Hasło musi mieć co najmniej 6 znaków");
        }
        String email = req.getEmail().trim().toLowerCase();
        if (patientRepository.existsByEmail(email) || doctorRepository.findByEmail(email).isPresent()
                || email.equals(adminEmail.toLowerCase())) {
            throw new ConflictException("Konto z takim adresem email już istnieje");
        }
        Patient p = new Patient();
        p.setName(req.getName().trim());
        p.setSurname(req.getSurname().trim());
        p.setEmail(email);
        p.setLogin(email);
        p.setPhone(req.getPhone().trim());
        p.setPassword(passwordEncoder.encode(req.getPassword()));
        p = patientRepository.save(p);
        return respond(new AuthUser(p.getId(), p.getEmail(), "PATIENT"), p.getName() + " " + p.getSurname());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        if (isBlank(req.getEmail()) || isBlank(req.getPassword())) {
            throw new UnauthorizedException("Nieprawidłowy email lub hasło");
        }
        String email = req.getEmail().trim().toLowerCase();
        String password = req.getPassword();

        if (email.equals(adminEmail.toLowerCase()) && constantTimeEquals(password, adminPassword)) {
            return respond(new AuthUser(0L, adminEmail, "ADMIN"), "Administrator");
        }
        var patient = patientRepository.findByEmail(email);
        if (patient.isPresent() && matches(password, patient.get().getPassword())) {
            Patient p = patient.get();
            return respond(new AuthUser(p.getId(), p.getEmail(), "PATIENT"), p.getName() + " " + p.getSurname());
        }
        var doctor = doctorRepository.findByEmail(email);
        if (doctor.isPresent() && matches(password, doctor.get().getPassword())) {
            Doctor d = doctor.get();
            return respond(new AuthUser(d.getId(), d.getEmail(), "DOCTOR"), "dr " + d.getName() + " " + d.getSurname());
        }
        throw new UnauthorizedException("Nieprawidłowy email lub hasło");
    }

    private AuthResponse respond(AuthUser user, String name) {
        return new AuthResponse(jwtService.generateToken(user), user.role(), user.id(), name);
    }

    private boolean matches(String raw, String hash) {
        return hash != null && hash.startsWith("$2") && passwordEncoder.matches(raw, hash);
    }

    private boolean constantTimeEquals(String a, String b) {
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
