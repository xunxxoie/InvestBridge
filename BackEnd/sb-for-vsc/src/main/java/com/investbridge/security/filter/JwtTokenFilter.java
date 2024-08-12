package com.investbridge.security.filter;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.investbridge.model.dto.Object.UserDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.security.TokenBlacklist;
import com.investbridge.service.UserService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenFilter extends OncePerRequestFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklist tokenBlacklist;
    private final UserService userService;
    
    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider, TokenBlacklist tokenBlacklist, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklist = tokenBlacklist;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
                                    throws ServletException, IOException {
        logger.info("JwtTokenFIlter is processing a request to {}", request.getRequestURI());
        String accessToken = getTokenFromRequest(request);
        
        if ("/api/auth/login".equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Verify AccessToken "is vaild?"
            if (!jwtTokenProvider.validateAccessToken(accessToken)) {
                throw new JwtException("Invalid token");
            }
            
            if(tokenBlacklist.isBlacklisted(accessToken)) 
                throw new BadCredentialsException("Not Available Authority");

                UserDTO user = jwtTokenProvider.getUserbyToken(accessToken);
                Authentication auth = new UsernamePasswordAuthenticationToken(user.getUserEmail(), null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
                logger.debug("Set Authentication to security context for '{}', uri: {}", user.getUserEmail(), request.getRequestURI());

        } catch (BadCredentialsException e) {

            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authentication failed: " + e.getMessage());

        } catch (ExpiredJwtException e){

            //Generate new AccessToken, When accessToken is expired!
            handleExpiredToken(request, response, accessToken); 

        } catch (JwtException e) {
            // Handle invalid token
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token: " + e.getMessage());
        } catch (Exception e) {

            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Internal Sever Error");
        }

        filterChain.doFilter(request, response);
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

    private void handleExpiredToken(HttpServletRequest request, HttpServletResponse response, String accessToken) throws IOException{
        try{
            String userEmail = jwtTokenProvider.getUserEmailFromExpiredToken(accessToken);
            String refreshToken = userService.getRefreshToken(userEmail);

            try{
                if(refreshToken != null && jwtTokenProvider.validateRefreshToken(refreshToken)){
                    UserDTO user = userService.getUserInfoFromUserEmail(userEmail);
                    String newAccessToken = jwtTokenProvider.generateAccessToken(user.getUserId(), user.getUserEmail(), user.getUserName(), user.getPhoneNumber(), user.getUserRole());
                    
                    Cookie jwtCookie = new Cookie("jwt", newAccessToken);
                    jwtCookie.setHttpOnly(true);
                    jwtCookie.setPath("/");
                    jwtCookie.setMaxAge(24*60*60);
                    
                    response.addCookie(jwtCookie);
        
                    Authentication newAuth = new UsernamePasswordAuthenticationToken(user.getUserEmail(), null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(newAuth);
            }
            }catch(ExpiredJwtException e){
                //Redirect Login Page, When refreshToken is also expired
                SecurityContextHolder.clearContext();
        
                // Clear the existing JWT cookie
                Cookie jwtCookie = new Cookie("jwt", null);
                jwtCookie.setMaxAge(0);
                jwtCookie.setPath("/");
                response.addCookie(jwtCookie);
            

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setHeader("X-Auth-Error", "refresh_token_expired");
                
                logger.info("Refresh token expired. Sending 401 with custom header.");
            }
        }catch (Exception e){
            logger.error("Internal Server Error", e);
        }
    }
}