package com.tableturn.repository;

import com.tableturn.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByTableIdAndReservationDate(
            Long tableId,
            LocalDate reservationDate
    );

        boolean existsByTable_Id(Long tableId);
}