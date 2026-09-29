package com.tableturn.repository;

import com.tableturn.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<RestaurantTable, Long> {

}