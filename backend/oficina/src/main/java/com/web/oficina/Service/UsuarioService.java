/*Cadastro seguro e não autenticação */
package com.web.oficina.Service;

import com.web.oficina.Model.Usuario;
import com.web.oficina.Repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service /*Indica que a classe tem lógica de negócio */
   public class UsuarioService {
   private final UsuarioRepository usuarioRepository;
   private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        BCryptPasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
    }

   public Usuario cadastrar(Usuario usuario) {
    usuario.setTipo("CLIENTE");

    usuario.setSenha(
        passwordEncoder.encode(usuario.getSenha())
    );

    return usuarioRepository.save(usuario);
    }
    
    /*verificação credenciais */
    public Usuario login(String email, String senha) {
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() ->
            new IllegalArgumentException("Email ou senha inválidos")
        );

    if (!passwordEncoder.matches(senha, usuario.getSenha())) {
        throw new IllegalArgumentException("Email ou senha inválidos");
    }

    return usuario;
    }

    public Usuario buscarPorId(Long id) {
    return usuarioRepository.findById(id)
        .orElseThrow(() ->
            new IllegalArgumentException("Usuário não encontrado")
        );
    }

    
    public void excluir(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() ->
            new IllegalArgumentException("Usuário não encontrado")
        );

    usuarioRepository.delete(usuario);
    }


}