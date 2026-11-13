/*cria e valida token */
package com.web.oficina.Service;

import com.web.oficina.Model.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/*Esta classe gera tokens assinados que expira em 24hrs */
@Service
public class TokenService {

    private final SecretKey chave;

    public TokenService(@Value("${jwt.secret}") String segredo) {
        byte[] bytes = segredo.getBytes(StandardCharsets.UTF_8);

        if (bytes.length < 32) {
            throw new IllegalArgumentException(
                "A chave JWT deve ter pelo menos 32 bytes"
            );
        }

        this.chave = Keys.hmacShaKeyFor(bytes);
    }

    public String gerarToken(Usuario usuario) {
        Date agora = new Date();
        Date expiracao = new Date(
            agora.getTime() + 1000L * 60 * 60 * 24
        );

        return Jwts.builder()
            .subject(usuario.getEmail())
            .claim("tipo", usuario.getTipo())
            .issuedAt(agora)
            .expiration(expiracao)
            .signWith(chave)
            .compact();
    }

    public String validarTokenEObterEmail(String token) {
        return Jwts.parser()
            .verifyWith(chave)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }
}
