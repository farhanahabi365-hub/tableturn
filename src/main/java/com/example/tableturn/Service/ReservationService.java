package com.tableturn.service;

import com.tableturn.entity.Reservation;
import com.tableturn.entity.RestaurantTable;
import com.tableturn.repository.ReservationRepository;
import com.tableturn.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

        private final ReservationRepository reservationRepository;
        private final TableRepository tableRepository;

        public ReservationService(
                        ReservationRepository reservationRepository,
                        TableRepository tableRepository) {

                this.reservationRepository = reservationRepository;
                this.tableRepository = tableRepository;
        }

        public Reservation createReservation(Reservation reservation) {

    RestaurantTable table = tableRepository
            .findById(reservation.getTable().getId())
            .orElseThrow(() ->
                    new RuntimeException("Table not found"));

        if (!"FREE".equals(table.getStatus())) {
                throw new RuntimeException("Table is not available");
        }

    // Check table capacity
    if (reservation.getPartySize() > table.getCapacity()) {
        throw new RuntimeException(
                "Party size is greater than table capacity");
    }

    // Check valid time
    if (!reservation.getStartTime()
            .isBefore(reservation.getEndTime())) {

        throw new RuntimeException(
                "Start time must be before end time");
    }

    // Get existing reservations
    List<Reservation> existingReservations =
            reservationRepository
                    .findByTableIdAndReservationDate(
                            table.getId(),
                            reservation.getReservationDate()
                    );

    // Check overlapping reservation
    for (Reservation existing : existingReservations) {

        boolean overlapping =
                reservation.getStartTime()
                        .isBefore(existing.getEndTime())
                &&
                reservation.getEndTime()
                        .isAfter(existing.getStartTime());

        if (overlapping) {
            throw new RuntimeException(
                    "Table is already reserved for this time");
        }
    }

    reservation.setTable(table);

    table.setStatus("RESERVED");
    tableRepository.save(table);

        return reservationRepository.save(reservation);
        }

        public List<Reservation> getAllReservations() {
                return reservationRepository.findAll();
        }
}