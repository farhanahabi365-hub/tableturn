package com.tableturn.controller;

import com.tableturn.entity.RestaurantTable;
import com.tableturn.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping
    public RestaurantTable createTable(
            @RequestBody RestaurantTable table) {

        return tableService.createTable(table);
    }

    @GetMapping
    public List<RestaurantTable> getAllTables() {

        return tableService.getAllTables();
    }

    @GetMapping("/{id}")
    public RestaurantTable getTableById(
            @PathVariable Long id) {

        return tableService.getTableById(id);
    }

    @PutMapping("/{id}")
    public RestaurantTable updateTable(
            @PathVariable Long id,
            @RequestBody RestaurantTable table) {

        return tableService.updateTable(id, table);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}