package com.tableturn.service;

import com.tableturn.entity.Bill;
import com.tableturn.entity.Order;
import com.tableturn.entity.OrderItem;
import com.tableturn.entity.RestaurantTable;
import com.tableturn.repository.BillRepository;
import com.tableturn.repository.OrderRepository;
import com.tableturn.repository.TableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    public BillService(
            BillRepository billRepository,
            OrderRepository orderRepository,
            TableRepository tableRepository) {

        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
    }

    @Transactional
    public Bill generateBill(Long tableId) {

        // Find table
        RestaurantTable table = tableRepository
                .findById(tableId)
                .orElseThrow(() ->
                        new RuntimeException("Table not found"));

        // Get orders for table
        List<Order> orders =
                orderRepository.findByTableId(tableId);

        List<Order> openOrders = orders.stream()
            .filter(order -> "OPEN".equalsIgnoreCase(order.getStatus()))
            .toList();

        if (openOrders.isEmpty()) {
            throw new RuntimeException(
                "No open orders found for this table");
        }

        // Calculate total
        double total = 0;

        for (Order order : openOrders) {

            for (OrderItem item : order.getItems()) {

                total += item.getQuantity()
                        * item.getPrice();
            }
        }

        // Create bill
        Bill bill = new Bill();

        bill.setTable(table);
        bill.setTotalAmount(total);
        bill.setBillTime(LocalDateTime.now());
        bill.setStatus("PAID");

        openOrders.forEach(order -> order.setStatus("PAID"));
        orderRepository.saveAll(openOrders);

        // Make table free
        table.setStatus("FREE");
        tableRepository.save(table);

        // Save bill
        return billRepository.save(bill);
    }

    public Bill getBillById(Long id) {

        return billRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found"));
    }

    public List<Bill> getBillsByTable(Long tableId) {

        return billRepository.findByTableId(tableId);
    }
}