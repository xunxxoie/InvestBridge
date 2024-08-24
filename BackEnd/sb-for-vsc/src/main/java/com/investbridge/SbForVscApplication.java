package com.investbridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.investbridge")
@ComponentScan(basePackages = {"com.investbridge"})
@EnableScheduling
public class SbForVscApplication {

	public static void main(String[] args) {
		SpringApplication.run(SbForVscApplication.class, args);
	}
}
