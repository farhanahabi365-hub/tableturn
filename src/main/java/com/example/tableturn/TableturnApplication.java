package com.example.tableturn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.tableturn", "com.tableturn"})
@EntityScan(basePackages = "com.tableturn.entity")
@EnableJpaRepositories(basePackages = "com.tableturn.repository")
public class TableturnApplication {

	public static void main(String[] args) {
		SpringApplication.run(TableturnApplication.class, args);
	}
}