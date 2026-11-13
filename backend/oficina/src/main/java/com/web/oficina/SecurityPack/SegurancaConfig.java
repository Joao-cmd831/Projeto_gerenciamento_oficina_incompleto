package com.web.oficina.SecurityPack;

import com.web.oficina.Config.FiltroJwt;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SegurancaConfig {

    private final FiltroJwt filtroJwt;

    public SegurancaConfig(FiltroJwt filtroJwt) {
        this.filtroJwt = filtroJwt;
    }

    @Bean
    public SecurityFilterChain configurarSeguranca(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .exceptionHandling(ex -> ex

                .authenticationEntryPoint((request, response, exception) -> {
                    System.out.println(
                        "401 - Falha de autenticacao: "
                        + request.getMethod() + " "
                        + request.getRequestURI()
                        + " | " + exception.getMessage()
                    );

                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Autenticacao necessaria"
                    );
                })

                .accessDeniedHandler((request, response, exception) -> {
                    System.out.println(
                        "403 - Acesso negado: "
                        + request.getMethod() + " "
                        + request.getRequestURI()
                        + " | " + exception.getMessage()
                    );

                    response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "Acesso negado"
                    );
                })
            )

            .authorizeHttpRequests(auth -> auth

                // Permite que o Spring trate os erros da aplicacao.
                .requestMatchers("/error").permitAll()

                // Libera requisicoes preliminares do CORS.
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Rotas publicas.
                .requestMatchers(
                    HttpMethod.POST,
                    "/auth/login",
                    "/usuarios"
                ).permitAll()

                // Somente administradores podem listar usuarios.
                .requestMatchers(
                    HttpMethod.GET,
                    "/usuarios"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores podem excluir usuarios.
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/usuarios/**"
                ).hasRole("ADMINISTRADOR")

                // Demais rotas exigem autenticacao.
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                filtroJwt,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // Configuracao de comunicacao entre frontend e backend.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuracao = new CorsConfiguration();

        configuracao.setAllowedOrigins(
            List.of("http://localhost:5173")
        );

        configuracao.setAllowedMethods(
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );

        configuracao.setAllowedHeaders(
            List.of(HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE)
        );

        configuracao.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource origem =
            new UrlBasedCorsConfigurationSource();

        origem.registerCorsConfiguration("/**", configuracao);

        return origem;
    }

    // Impede que o filtro JWT seja registrado duas vezes.
    @Bean
    public FilterRegistrationBean<FiltroJwt> desabilitarRegistroAutomaticoFiltro(
            FiltroJwt filtroJwt) {

        FilterRegistrationBean<FiltroJwt> registro =
            new FilterRegistrationBean<>(filtroJwt);

        registro.setEnabled(false);

        return registro;
    }

    // Codificacao das senhas com BCrypt.
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
