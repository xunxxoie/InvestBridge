package com.investbridge.security.filter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import com.investbridge.security.TokenBlacklist;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LogoutFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(LogoutFilter.class);
    private final TokenBlacklist tokenBlacklist;

    public LogoutFilter(TokenBlacklist tokenBlacklist) {
        this.tokenBlacklist = tokenBlacklist;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        

        if ("/api/auth/logout".equals(request.getRequestURI()) && "POST".equalsIgnoreCase(request.getMethod())) {
            logger.info("LogoutFilter is processing a request to {}", request.getRequestURI());
            logger.info("Logout processing is start");
            String token = getTokenFromRequest(request);
            
            if (token != null)
                tokenBlacklist.addToBlacklist(token);

            Cookie cookie = new Cookie("jwt", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);

            response.setStatus(HttpServletResponse.SC_OK);
            try {
                response.getWriter().write("Logout Succeed");
            } catch (IOException e) {
                logger.error("Error writing response", e);
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

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
