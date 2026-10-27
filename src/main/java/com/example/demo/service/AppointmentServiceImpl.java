package com.example.demo.service;

import com.example.demo.DTO.AppointmentDTO;
import com.example.demo.DTO.AppointmentRequest;
import com.example.demo.exception.ConflictException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentStatus;
import com.example.demo.model.Doctor;
import com.example.demo.model.Patient;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import com.example.demo.security.AuthUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private static final LocalTime WORK_START = LocalTime.of(9, 0);
    private static final LocalTime WORK_END = LocalTime.of(17, 0);
    private static final int SLOT_MINUTES = 30;

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  DoctorRepository doctorRepository,
                                  PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public AppointmentDTO bookAppointment(Long patientId, AppointmentRequest request) {
        if (request.getDoctorId() == null || request.getDateTime() == null) {
            throw new ConflictException("doctorId i dateTime są wymagane");
        }
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Lekarz z id " + request.getDoctorId() + " nie istnieje"));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Pacjent z id " + patientId + " nie istnieje"));

        LocalDateTime dt = request.getDateTime().withSecond(0).withNano(0);
        if (!dt.isAfter(LocalDateTime.now())) {
            throw new ConflictException("Nie można zarezerwować wizyty w przeszłości");
        }
        if (!isValidSlot(dt.toLocalTime())) {
            throw new ConflictException("Wizyty są możliwe co 30 minut między 09:00 a 17:00");
        }
        if (appointmentRepository.existsByDoctorIdAndDateTimeAndStatus(doctor.getId(), dt, AppointmentStatus.ACTIVE)) {
            throw new ConflictException("Ten termin jest już zajęty");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setDateTime(dt);
        appointment.setStatus(AppointmentStatus.ACTIVE);
        return toDto(appointmentRepository.save(appointment));
    }

    @Override
    public AppointmentDTO cancelAppointment(Long id, AuthUser user) {
        Appointment appointment = getOrThrow(id);
        checkAccess(appointment, user);
        if (appointment.getStatus() != AppointmentStatus.ACTIVE) {
            throw new ConflictException("Można anulować tylko aktywną wizytę");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return toDto(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDTO findById(Long id, AuthUser user) {
        Appointment appointment = getOrThrow(id);
        checkAccess(appointment, user);
        return toDto(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> findMy(AuthUser user) {
        List<Appointment> list = switch (user.role()) {
            case "PATIENT" -> appointmentRepository.findByPatientIdOrderByDateTimeDesc(user.id());
            case "DOCTOR" -> appointmentRepository.findByDoctorIdOrderByDateTimeAsc(user.id());
            default -> throw new AccessDeniedException("Brak dostępu");
        };
        return list.stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDTO> findAll() {
        return appointmentRepository.findAll().stream().map(this::toDto).toList();
    }

    /** Wizytę widzi/anuluje tylko jej pacjent, jej lekarz lub administrator. */
    private void checkAccess(Appointment a, AuthUser user) {
        boolean allowed = switch (user.role()) {
            case "ADMIN" -> true;
            case "PATIENT" -> a.getPatient().getId().equals(user.id());
            case "DOCTOR" -> a.getDoctor().getId().equals(user.id());
            default -> false;
        };
        if (!allowed) {
            throw new AccessDeniedException("Brak dostępu do tej wizyty");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocalDateTime> findFreeSlots(Long doctorId, LocalDate date) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Lekarz z id " + doctorId + " nie istnieje");
        }
        List<LocalDateTime> taken = appointmentRepository
                .findByDoctorIdAndDateTimeBetweenAndStatus(doctorId, date.atStartOfDay(),
                        date.plusDays(1).atStartOfDay(), AppointmentStatus.ACTIVE)
                .stream().map(Appointment::getDateTime).toList();

        List<LocalDateTime> free = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (LocalTime t = WORK_START; t.isBefore(WORK_END); t = t.plusMinutes(SLOT_MINUTES)) {
            LocalDateTime slot = date.atTime(t);
            if (slot.isAfter(now) && !taken.contains(slot)) {
                free.add(slot);
            }
        }
        return free;
    }

    /** Wizyty ACTIVE starsze niż 24h automatycznie przechodzą w COMPLETED. */
    @Override
    @Scheduled(fixedRate = 3600000)
    public void completePastAppointments() {
        appointmentRepository.findByStatusAndDateTimeBefore(AppointmentStatus.ACTIVE, LocalDateTime.now().minusHours(24))
                .forEach(a -> a.setStatus(AppointmentStatus.COMPLETED));
    }

    private boolean isValidSlot(LocalTime t) {
        return !t.isBefore(WORK_START) && t.isBefore(WORK_END) && t.getMinute() % SLOT_MINUTES == 0;
    }

    private Appointment getOrThrow(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wizyta z id " + id + " nie istnieje"));
    }

    private AppointmentDTO toDto(Appointment a) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(a.getId());
        dto.setDateTime(a.getDateTime());
        dto.setStatus(a.getStatus());
        dto.setDoctorId(a.getDoctor().getId());
        dto.setDoctorName(a.getDoctor().getName() + " " + a.getDoctor().getSurname());
        dto.setDoctorProfession(a.getDoctor().getProfession());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientName(a.getPatient().getName() + " " + a.getPatient().getSurname());
        dto.setPatientPhone(a.getPatient().getPhone());
        return dto;
    }
}
