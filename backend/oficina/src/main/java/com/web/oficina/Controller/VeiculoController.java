
package com.web.oficina.Controller;

import com.web.oficina.Model.Usuario;
import com.web.oficina.Model.Cliente;
import com.web.oficina.Model.Veiculo;
import com.web.oficina.Service.ClienteService;
import com.web.oficina.Service.VeiculoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;
    private final ClienteService clienteService;

    public VeiculoController(
            VeiculoService veiculoService,
            ClienteService clienteService) {
        this.veiculoService = veiculoService;
        this.clienteService = clienteService;
    }

    /* Verifica se o usuário é administrador */
    private boolean isAdministrador(Usuario usuario) {
        return "ADMINISTRADOR".equals(usuario.getTipo());
    }

    /* Obtém o cadastro de cliente do usuário autenticado */
    private Cliente obterClienteAutenticado(Usuario usuario) {
        return clienteService.buscarPorUsuarioId(usuario.getId());
    }

    /* Cadastrar veículo */
    @PostMapping
    public ResponseEntity<Map<String, Object>> cadastrar(
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        String placa = (String) dados.get("placa");
        String marca = (String) dados.get("marca");
        String modelo = (String) dados.get("modelo");
        String cor = (String) dados.get("cor");

        Integer ano = dados.get("ano") instanceof Number
                ? ((Number) dados.get("ano")).intValue()
                : null;

        if (placa == null || placa.isBlank()
                || marca == null || marca.isBlank()
                || modelo == null || modelo.isBlank()) {

            return ResponseEntity.badRequest().body(
                Map.of("erro", "Placa, marca e modelo são obrigatórios"));
        }

        Long clienteId;

        if (isAdministrador(usuario)) {

            Object clienteIdObj = dados.get("clienteId");

            if (clienteIdObj == null) {
                return ResponseEntity.badRequest().body(
                    Map.of("erro", "clienteId é obrigatório"));
            }

            try {
                clienteId = Long.valueOf(clienteIdObj.toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(
                    Map.of("erro", "clienteId deve ser um número válido"));
            }

        } else {

            if (dados.containsKey("clienteId")) {
                return ResponseEntity.badRequest().body(
                    Map.of("erro", "O cliente não pode informar outro clienteId"));
            }

            Cliente cliente = obterClienteAutenticado(usuario);
            clienteId = cliente.getId();
        }

        Veiculo veiculo = veiculoService.cadastrar(
            placa, marca, modelo, ano, cor, clienteId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(converterResposta(veiculo));
    }

    /* Listar veículos */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listar(
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        List<Veiculo> veiculos;

        if (isAdministrador(usuario)) {
            veiculos = veiculoService.listar();
        } else {
            Cliente cliente = obterClienteAutenticado(usuario);
            veiculos = veiculoService.listarPorCliente(cliente.getId());
        }

        return ResponseEntity.ok(
            veiculos.stream().map(this::converterResposta).toList());
    }

    /* Buscar veículo pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        Veiculo veiculo;

        if (isAdministrador(usuario)) {
            veiculo = veiculoService.buscarPorId(id);
        } else {
            Cliente cliente = obterClienteAutenticado(usuario);

            veiculo = veiculoService.buscarPorIdECliente(
                id, cliente.getId());
        }

        return ResponseEntity.ok(converterResposta(veiculo));
    }

    /* Atualizar veículo */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        String placa = (String) dados.get("placa");
        String marca = (String) dados.get("marca");
        String modelo = (String) dados.get("modelo");
        String cor = (String) dados.get("cor");

        Integer ano = dados.get("ano") instanceof Number
                ? ((Number) dados.get("ano")).intValue()
                : null;

        if (placa == null || placa.isBlank()
                || marca == null || marca.isBlank()
                || modelo == null || modelo.isBlank()) {

            return ResponseEntity.badRequest().body(
                Map.of("erro", "Placa, marca e modelo são obrigatórios"));
        }

        Veiculo veiculo;

        if (isAdministrador(usuario)) {
            veiculo = veiculoService.atualizar(
                id, placa, marca, modelo, ano, cor);
        } else {
            Cliente cliente = obterClienteAutenticado(usuario);

            veiculo = veiculoService.atualizarDoCliente(
                id, cliente.getId(), placa, marca, modelo, ano, cor);
        }

        return ResponseEntity.ok(converterResposta(veiculo));
    }

    /* Excluir veículo */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (isAdministrador(usuario)) {
            veiculoService.excluir(id);
        } else {
            Cliente cliente = obterClienteAutenticado(usuario);

            veiculoService.excluirDoCliente(id, cliente.getId());
        }

        return ResponseEntity.ok(
            Map.of("mensagem", "Veículo excluído com sucesso"));
    }

    /* Converter veículo para resposta JSON */
    private Map<String, Object> converterResposta(Veiculo veiculo) {

        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", veiculo.getId());
        resposta.put("placa", veiculo.getPlaca());
        resposta.put("marca", veiculo.getMarca());
        resposta.put("modelo", veiculo.getModelo());
        resposta.put("ano", veiculo.getAno());
        resposta.put("cor", veiculo.getCor());
        resposta.put("clienteId", veiculo.getCliente().getId());

        return resposta;
    }
}