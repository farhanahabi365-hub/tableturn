package com.tableturn.controller;

import com.tableturn.entity.Reservation;
import com.tableturn.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService) {

        this.reservationService = reservationService;
    }

    @PostMapping
    public Reservation createReservation(
            @RequestBody Reservation reservation) {

        return reservationService
                .createReservation(reservation);
    }

    @GetMapping
    public List<Reservation> getAllReservations() {

        return reservationService
                .getAllReservations();
    }
}