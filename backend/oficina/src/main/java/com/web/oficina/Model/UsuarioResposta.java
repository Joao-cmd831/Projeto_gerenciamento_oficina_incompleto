/* Arquivo que define quais dados podem sair da API */

package com.web.oficina.Model;

public record UsuarioResposta(
    Long id,
    String nome,
    String email,
    String tipo
) {
    public static UsuarioResposta de(Usuario usuario) {
        return new UsuarioResposta(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTipo()
        );/*não há senha > para devolver os dados do usuário sem o hash */
    }
}