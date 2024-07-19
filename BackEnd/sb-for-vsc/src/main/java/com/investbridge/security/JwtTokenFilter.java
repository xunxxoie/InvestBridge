package com.investbridge.security;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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

        if(token != null && jwtTokenProvider.validateToken(token)){ // validate Jwt token from request

            String userName = jwtTokenProvider.getUserNameFromToken(token); // extract userName from token
            String userRole = jwtTokenProvider.getUserRoleFromToken(token); // extract userRole from token
            
            List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userRole)); // Convert type to List for adding userRole
            
            // Add auth(Token that contains userName, authorites -> userRole) 
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userName, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);

    }

    /**
     * Why use "HttpServletRequest"??
     *  1. 별다른 구현 없이, HTTP 요청을 받아와 다룰 수 있음. 
     *  2. 클라이언트가 서버로 보낸 HTTP 요청들을 캡슐화해서 갖고 있음. 
     */
    private String getTokenFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization"); // Header Component that contains jwt Token
        
        if(bearerToken != null && bearerToken.startsWith("Bearer ")) // Because JWT usually starts with "Bearer "
            return bearerToken.substring(7); // return bearerToken excludes "Bearer "!
        
        return null;
    }

}