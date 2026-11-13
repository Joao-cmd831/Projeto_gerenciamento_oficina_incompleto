
package com.web.oficina.Controller;

import com.web.oficina.Model.Agendamento;
import com.web.oficina.Service.AgendamentoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    /*Cadastrar */

    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> cadastrar(
            @RequestBody Map<String, Object> dados) {

        LocalDate data = LocalDate.parse(
                dados.get("dataAgendamento").toString());

        LocalTime horario = LocalTime.parse(
                dados.get("horario").toString());

        Long clienteId = Long.valueOf(
                dados.get("clienteId").toString());

        Long veiculoId = Long.valueOf(
                dados.get("veiculoId").toString());

        Object valorServicos = dados.get("servicoIds");

        if (!(valorServicos instanceof List<?> lista)) {
            throw new IllegalArgumentException(
                    "Informe a lista de IDs dos serviços");
        }

        List<Long> servicoIds = lista.stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();

        Agendamento agendamento = agendamentoService.cadastrar(
                data, horario, clienteId, veiculoId, servicoIds);

        return converterResposta(agendamento);
    }

    /*Listar todos */

    @GetMapping
    public List<Map<String, Object>> listar() {
        return agendamentoService.listar()
                .stream()
                .map(this::converterResposta)
                .toList();
    }

    /*Consultar por id */

    @GetMapping("/{id}")
    public Map<String, Object> buscarPorId(@PathVariable Long id) {
        return converterResposta(
                agendamentoService.buscarPorId(id));
    }

    /*Cancelar */

    @PatchMapping("/{id}/cancelar")
    public Map<String, Object> cancelar(@PathVariable Long id) {
        return converterResposta(
                agendamentoService.cancelar(id));
    }

    private Map<String, Object> converterResposta(
            Agendamento agendamento) {

        Map<String, Object> resposta = new LinkedHashMap<>();

        resposta.put("id", agendamento.getId());
        resposta.put("dataAgendamento",
                agendamento.getDataAgendamento());
        resposta.put("horario", agendamento.getHorario());
        resposta.put("status", agendamento.getStatus());
        resposta.put("clienteId",
                agendamento.getCliente().getId());
        resposta.put("veiculoId",
                agendamento.getVeiculo().getId());

        resposta.put("servicos", agendamento.getServicos()
                .stream()
                .map(servico -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", servico.getId());
                    item.put("nome", servico.getNome());
                    item.put("preco", servico.getPreco());
                    return item;
                })
                .toList());

        return resposta;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
    agendamentoService.excluir(id);
    }
}
