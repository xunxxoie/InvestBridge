package com.investbridge.security.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import com.investbridge.security.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AdminAuthorizationFilter extends OncePerRequestFilter{
    
    private final JwtTokenProvider jwtTokenProvider;

    public AdminAuthorizationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        if (isAdminRequest(request)) {
            if (!isAdminAuthorized(request)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean isAdminRequest(HttpServletRequest request){
        return request.getRequestURI().startsWith("/admin");
    }

    private boolean isAdminAuthorized(HttpServletRequest request){
        String token = getTokenFromRequest(request);
        if(jwtTokenProvider.getUserRoleFromToken(token).equals("ADMIN")){
            return true;
        }else{
            return false;
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie cookie : cookies) {
            if ("jwt".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
    }
    return null;
}
}
