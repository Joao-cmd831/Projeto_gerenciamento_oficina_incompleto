
package com.web.oficina.Repository;

import com.web.oficina.Model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/* Repositório responsável pelas operações com Cliente */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /* Verifica se um usuário já possui cadastro de cliente */
    boolean existsByUsuario_Id(Long usuarioId);

    /* Busca o cliente associado ao ID de um usuário */
    Optional<Cliente> findByUsuario_Id(Long usuarioId);
}
