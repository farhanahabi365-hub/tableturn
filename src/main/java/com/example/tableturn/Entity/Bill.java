package com.tableturn.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double totalAmount;

    private LocalDateTime billTime;

    private String status;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private RestaurantTable table;

    public Bill() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getBillTime() {
        return billTime;
    }

    public void setBillTime(LocalDateTime billTime) {
        this.billTime = billTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public RestaurantTable getTable() {
        return table;
    }

    public void setTable(RestaurantTable table) {
        this.table = table;
    }
}