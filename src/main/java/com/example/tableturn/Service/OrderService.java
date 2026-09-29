package com.tableturn.service;

import com.tableturn.entity.Order;
import com.tableturn.entity.OrderItem;
import com.tableturn.entity.RestaurantTable;
import com.tableturn.repository.OrderRepository;
import com.tableturn.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    public OrderService(
            OrderRepository orderRepository,
            TableRepository tableRepository) {

        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
    }

    public Order createOrder(Order order) {

        // Find table
        if (order.getTable() == null ||
                order.getTable().getId() == null) {

            throw new RuntimeException(
                    "Table ID is required");
        }

        RestaurantTable table = tableRepository
                .findById(order.getTable().getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Table not found"));

        // Check table status
        if (!"RESERVED".equals(table.getStatus())
                && !"OCCUPIED".equals(table.getStatus())) {

            throw new RuntimeException(
                    "Table is not available for ordering");
        }

        // Set table as occupied
        table.setStatus("OCCUPIED");
        tableRepository.save(table);

        // Set order details
        order.setTable(table);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("OPEN");

        // Connect every item with this order
        if (order.getItems() != null) {

            for (OrderItem item : order.getItems()) {

                item.setOrder(order);
            }
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByTable(Long tableId) {

        return orderRepository.findByTableId(tableId);
    }

    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"));
    }
}