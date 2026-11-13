package com.web.oficina.Service;

import com.web.oficina.Model.Agendamento;
import com.web.oficina.Model.Cliente;
import com.web.oficina.Model.Servico;
import com.web.oficina.Model.Veiculo;
import com.web.oficina.Repository.AgendamentoRepository;
import com.web.oficina.Repository.ClienteRepository;
import com.web.oficina.Repository.ServicoRepository;
import com.web.oficina.Repository.VeiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final VeiculoRepository veiculoRepository;
    private final ServicoRepository servicoRepository;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            ClienteRepository clienteRepository,
            VeiculoRepository veiculoRepository,
            ServicoRepository servicoRepository) {

        this.agendamentoRepository = agendamentoRepository;
        this.clienteRepository = clienteRepository;
        this.veiculoRepository = veiculoRepository;
        this.servicoRepository = servicoRepository;
    }

    public Agendamento cadastrar(
            LocalDate data,
            LocalTime horario,
            Long clienteId,
            Long veiculoId,
            List<Long> servicoIds) {

        if (data.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "A data do agendamento não pode estar no passado");
        }

        if (data.equals(LocalDate.now())
                && horario.isBefore(LocalTime.now())) {
            throw new IllegalArgumentException(
                    "O horário do agendamento não pode estar no passado");
        }

        if (servicoIds == null || servicoIds.isEmpty()) {
            throw new IllegalArgumentException(
                "O agendamento precisa ter pelo menos um serviço");
        }

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Cliente não encontrado"));

        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Veículo não encontrado"));

        if (!veiculo.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException(
                "Este veículo não pertence ao cliente informado");
        }

        boolean ocupado =
                agendamentoRepository
                        .existsByDataAgendamentoAndHorarioAndStatusNot(
                                data, horario, "CANCELADO");

        if (ocupado) {
            throw new IllegalArgumentException(
                    "Este horário já está ocupado");
        }

        List<Servico> servicos = new ArrayList<>();

        for (Long servicoId : servicoIds) {
            Servico servico = servicoRepository.findById(servicoId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Serviço não encontrado: " + servicoId));

            if (!Boolean.TRUE.equals(servico.getAtivo())) {
                throw new IllegalArgumentException(
                        "O serviço está inativo: " + servico.getNome());
            }

            if (servicos.stream().noneMatch(
                    s -> s.getId().equals(servicoId))) {
                servicos.add(servico);
            }
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setDataAgendamento(data);
        agendamento.setHorario(horario);
        agendamento.setStatus("PENDENTE");
        agendamento.setCliente(cliente);
        agendamento.setVeiculo(veiculo);
        agendamento.setServicos(servicos);

        return agendamentoRepository.save(agendamento);
    }

    public List<Agendamento> listar() {
        return agendamentoRepository.findAll();
    }

    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Agendamento não encontrado"));
    }

    public Agendamento cancelar(Long id) {
        Agendamento agendamento = buscarPorId(id);
        agendamento.setStatus("CANCELADO");
        return agendamentoRepository.save(agendamento);
    }

    @Transactional
public void excluir(Long id) {
    Agendamento agendamento = buscarPorId(id);

    // Remove os vínculos entre o agendamento e os serviços
    agendamento.getServicos().clear();

    // Persiste a remoção dos vínculos antes de excluir
    agendamentoRepository.flush();

    // Exclui o agendamento
    agendamentoRepository.delete(agendamento);

    // Executa a exclusão no banco ainda dentro da transação
    agendamentoRepository.flush();
    } 
}
