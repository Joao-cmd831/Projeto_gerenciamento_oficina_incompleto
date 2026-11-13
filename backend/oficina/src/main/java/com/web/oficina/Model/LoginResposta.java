package com.web.oficina.Model;
/*Trazerá os dados e acrescentará o token */
public record LoginResposta(
    Long id,
    String nome,
    String email,
    String tipo,
    String token
) {
}
