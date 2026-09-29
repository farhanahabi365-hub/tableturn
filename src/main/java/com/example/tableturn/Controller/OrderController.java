package com.tableturn.controller;

import com.tableturn.entity.Order;
import com.tableturn.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order createOrder(
            @RequestBody Order order) {

        return orderService.createOrder(order);
    }

    @GetMapping("/table/{tableId}")
    public List<Order> getOrdersByTable(
            @PathVariable Long tableId) {

        return orderService.getOrdersByTable(tableId);
    }

    @GetMapping("/{id}")
    public Order getOrderById(
            @PathVariable Long id) {

        return orderService.getOrderById(id);
    }
}