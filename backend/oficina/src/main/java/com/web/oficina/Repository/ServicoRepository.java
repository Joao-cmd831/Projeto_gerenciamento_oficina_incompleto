
package com.web.oficina.Repository;

import com.web.oficina.Model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    @Query(value = """
            SELECT
                (SELECT COUNT(*)
                 FROM ordem_servico_servico
                 WHERE servico_id = :id)
                +
                (SELECT COUNT(*)
                 FROM agendamento_servico
                 WHERE servico_id = :id)
            """, nativeQuery = true)
    Long contarUsos(@Param("id") Long id);
}
