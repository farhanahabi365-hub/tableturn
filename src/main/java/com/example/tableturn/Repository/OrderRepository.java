package com.tableturn.repository;

import com.tableturn.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByTableId(Long tableId);
}