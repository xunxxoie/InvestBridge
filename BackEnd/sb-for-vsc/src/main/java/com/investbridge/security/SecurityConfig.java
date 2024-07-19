package com.investbridge.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Value("${cors.allowed-origins}")
    private List<String> allowedOrigins;

    @Value("${cors.allowed-methods}")
    private List<String> allowedMethods;

    @Value("${cors.allowed-headers}")
    private List<String> allowedHeaders;

    @Value("${cors.exposed-headers}")
    private List<String> exposedHeaders;
    

    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Define Security Settings 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Activate CORS Setting == Allow specific domain(ex : localhost:3000 -> Client!!)
            .csrf(csrf -> csrf.disable()) // Inactivate csrf secure
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Inavtivate Session and keep STATELESS
            .authorizeHttpRequests(authz -> authz.requestMatchers("/api/login/**").permitAll()
                                                 .anyRequest().authenticated() // All requests that come to "/api/login/**" are granted; all other requests are authorized
            ).addFilterBefore(new JwtTokenFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    // Setting CORS Configurations
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(allowedMethods);
        configuration.setAllowedHeaders(allowedHeaders); // RequestHeaders that  client -> server
        configuration.setExposedHeaders(exposedHeaders); // ResponseHeaders that server -> client
        configuration.setAllowCredentials(true);

        //Applying Configurations
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}