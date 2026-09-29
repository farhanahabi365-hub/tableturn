package com.tableturn.service;

import com.tableturn.entity.RestaurantTable;
import com.tableturn.repository.ReservationRepository;
import com.tableturn.repository.TableRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TableService {

    private final TableRepository tableRepository;
    private final ReservationRepository reservationRepository;

    public TableService(
            TableRepository tableRepository,
            ReservationRepository reservationRepository) {

        this.tableRepository = tableRepository;
        this.reservationRepository = reservationRepository;
    }

    public RestaurantTable createTable(RestaurantTable table) {
        return tableRepository.save(table);
    }

    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Table not found"));
    }

    public RestaurantTable updateTable(Long id, RestaurantTable updatedTable) {
        RestaurantTable table = getTableById(id);
        table.setTableNumber(updatedTable.getTableNumber());
        table.setCapacity(updatedTable.getCapacity());
        table.setStatus(updatedTable.getStatus());
        return tableRepository.save(table);
    }

    public void deleteTable(Long id) {
        RestaurantTable table = getTableById(id);
        if (reservationRepository.existsByTable_Id(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete a table that has reservations");
        }
        tableRepository.delete(table);
    }
}