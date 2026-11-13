package com.web.oficina.Config;

import com.web.oficina.Model.Usuario;
import com.web.oficina.Repository.UsuarioRepository;
import com.web.oficina.Service.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class FiltroJwt extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public FiltroJwt(
            TokenService tokenService,
            UsuarioRepository usuarioRepository) {
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String autorizacao = request.getHeader("Authorization");

        System.out.println(
            "Requisicao: " + request.getMethod() + " " + request.getRequestURI()
        );

        System.out.println(
            "Authorization recebido: "
            + (autorizacao == null ? "NULL" : "Bearer presente")
        );

        if (autorizacao != null && autorizacao.startsWith("Bearer ")) {

            String token = autorizacao.substring(7);

            try {
                String email =
                    tokenService.validarTokenEObterEmail(token);

                Usuario usuario = usuarioRepository
                    .findByEmail(email)
                    .orElse(null);

                if (usuario == null) {
                    System.out.println(
                        "JWT valido, mas usuario nao encontrado no banco."
                    );

                    SecurityContextHolder.clearContext();

                } else {
                    var autenticacao =
                        new UsernamePasswordAuthenticationToken(
                            usuario,
                            null,
                            List.of(
                                new SimpleGrantedAuthority(
                                    "ROLE_" + usuario.getTipo()
                                )
                            )
                        );

                    SecurityContextHolder.getContext()
                        .setAuthentication(autenticacao);

                    System.out.println(
                        "Usuario autenticado: " + usuario.getEmail()
                    );

                    System.out.println(
                        "Perfil reconhecido: ROLE_" + usuario.getTipo()
                    );
                }

            } catch (
                    io.jsonwebtoken.JwtException
                    | IllegalArgumentException e) {

                System.out.println(
                    "Erro ao validar JWT: " + e.getMessage()
                );

                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}