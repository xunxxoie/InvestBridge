package com.investbridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.investbridge"})
public class SbForVscApplication {

	public static void main(String[] args) {
		SpringApplication.run(SbForVscApplication.class, args);
	}

}
