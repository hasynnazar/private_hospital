package com.example.demo.config;

import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Jednorazowa migracja: hasła zapisane wcześniej jawnym tekstem są haszowane BCrypt-em.
 * Hasło pozostaje takie samo, zmienia się tylko sposób jego przechowywania.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner hashLegacyPasswords(DoctorRepository doctors, PatientRepository patients, PasswordEncoder encoder) {
        return args -> {
            doctors.findAll().stream()
                    .filter(d -> d.getPassword() != null && !d.getPassword().startsWith("$2"))
                    .forEach(d -> {
                        d.setPassword(encoder.encode(d.getPassword()));
                        if (d.getEmail() != null) d.setEmail(d.getEmail().toLowerCase());
                        doctors.save(d);
                    });
            patients.findAll().stream()
                    .filter(p -> p.getPassword() != null && !p.getPassword().startsWith("$2"))
                    .forEach(p -> {
                        p.setPassword(encoder.encode(p.getPassword()));
                        if (p.getEmail() != null) p.setEmail(p.getEmail().toLowerCase());
                        patients.save(p);
                    });
        };
    }
}
