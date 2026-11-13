package com.web.oficina.Repository;

import com.web.oficina.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email); /*Verifica se o email já está cadastrado */
     
    /*permite tratar o caso em que o email não existe, sem retornar um usuário existente */
    Optional<Usuario> findByEmail(String email);/*recupera o usuario para verificarmos a senha */    
}