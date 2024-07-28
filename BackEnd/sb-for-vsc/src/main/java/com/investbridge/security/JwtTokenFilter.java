package com.investbridge.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
                                    throws ServletException, IOException {

         
        String token = getTokenFromRequest(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            if (!jwtTokenProvider.validateToken(token)) {
                throw new BadCredentialsException("Not Available Authority");
            }
            
            String userEmail = jwtTokenProvider.getUserEmailFromToken(token);
            Authentication auth = new UsernamePasswordAuthenticationToken(userEmail, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);
            
        } catch (BadCredentialsException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authentication failed: " + e.getMessage());
            return;
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Internal Server Error");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Why use "HttpServletRequest"??
     *  1. 별다른 구현 없이, HTTP 요청을 받아와 다룰 수 있음. 
     *  2. 클라이언트가 서버로 보낸 HTTP 요청들을 캡슐화해서 갖고 있음. 
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {  // "jwt"는 토큰을 저장한 쿠키의 이름. 필요시 변경
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}