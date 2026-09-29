package com.tableturn.repository;

import com.tableturn.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByTableId(Long tableId);
}