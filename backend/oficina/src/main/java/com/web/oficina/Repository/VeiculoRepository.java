package com.web.oficina.Repository;

import com.web.oficina.Model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    boolean existsByPlaca(String placa);

    // Busca todos os veículos vinculados a um cliente.
    List<Veiculo> findAllByCliente_Id(Long clienteId);

    // Busca um veículo específico pertencente a determinado cliente.
    Optional<Veiculo> findByIdAndCliente_Id(Long id, Long clienteId);

    @Query(value = """
        select count(*)
        from agendamento
        where veiculo_id = :id
        """, nativeQuery = true)
    Long contarAgendamentos(@Param("id") Long id);

    @Query(value = """
        select count(*)
        from ordem_servico
        where veiculo_id = :id
        """, nativeQuery = true)
    Long contarOrdensServico(@Param("id") Long id);
}
