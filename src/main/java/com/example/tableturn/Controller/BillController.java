package com.tableturn.controller;

import com.tableturn.entity.Bill;
import com.tableturn.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping("/table/{tableId}")
    public Bill generateBill(
            @PathVariable Long tableId) {

        return billService.generateBill(tableId);
    }

    @GetMapping("/{id}")
    public Bill getBillById(
            @PathVariable Long id) {

        return billService.getBillById(id);
    }

    @GetMapping("/table/{tableId}")
    public List<Bill> getBillsByTable(
            @PathVariable Long tableId) {

        return billService.getBillsByTable(tableId);
    }
}