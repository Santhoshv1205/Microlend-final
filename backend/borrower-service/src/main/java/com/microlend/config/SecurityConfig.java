package com.microlend.config;

import com.microlend.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // ── PUBLIC / INTER-SERVICE ENDPOINTS ─────────────────────────
                .requestMatchers("/actuator/health").permitAll()

                // ── SWAGGER UI — no authentication required ──────────────────
                .requestMatchers("/swagger-ui.html").permitAll()
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()

                // ── BORROWER MANAGEMENT ─────────────────────────────────────
                .requestMatchers("/api/borrowers/**")
                        .hasAnyRole("ADMIN", "CREDIT_OFFICER", "FIELD_OFFICER", "BRANCH_MANAGER")

                // FIELD_OFFICER may ONLY upload docs (POST /api/kyc).
                // PATCH /api/kyc/{id}/verify is ADMIN + CREDIT_OFFICER only.
                .requestMatchers(HttpMethod.POST, "/api/kyc")
                        .hasAnyRole("ADMIN", "CREDIT_OFFICER", "FIELD_OFFICER")
                .requestMatchers(HttpMethod.PATCH, "/api/kyc/{id}/verify")
                        .hasAnyRole("ADMIN", "CREDIT_OFFICER")
                .requestMatchers("/api/kyc/**")
                        .hasAnyRole("ADMIN", "CREDIT_OFFICER", "BRANCH_MANAGER")

                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
