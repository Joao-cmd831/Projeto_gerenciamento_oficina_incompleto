/*Este método verifica se existe agendamento no dia e horário */
package com.web.oficina.Repository;

import com.web.oficina.Model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface AgendamentoRepository
        extends JpaRepository<Agendamento, Long> {

    boolean existsByDataAgendamentoAndHorarioAndStatusNot(
            LocalDate dataAgendamento,
            LocalTime horario,
            String status
    );
}

