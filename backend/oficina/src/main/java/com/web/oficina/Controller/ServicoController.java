package com.web.oficina.Controller;

import com.web.oficina.Model.Servico;
import com.web.oficina.Model.Usuario;
import com.web.oficina.Service.ServicoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    // Verifica se o usuário autenticado é administrador
    private boolean isAdministrador(Usuario usuario) {
        return "ADMINISTRADOR".equals(usuario.getTipo());
    }

    // Cadastrar serviço: somente administrador
    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (!isAdministrador(usuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Apenas administradores podem cadastrar serviços"));
        }

        String nome = (String) dados.get("nome");
        String descricao = (String) dados.get("descricao");

        BigDecimal preco = dados.get("preco") instanceof Number
                ? new BigDecimal(dados.get("preco").toString())
                : null;

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome do serviço é obrigatório");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Informe um preço válido para o serviço");
        }

        Servico servico = servicoService.cadastrar(nome, descricao, preco);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(converterResposta(servico));
    }

    // Listar serviços: administrador e cliente
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listar() {

        List<Map<String, Object>> resposta = servicoService.listar()
                .stream()
                .map(this::converterResposta)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    // Consultar serviço: administrador e cliente
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                converterResposta(servicoService.buscarPorId(id))
        );
    }

    // Atualizar serviço: somente administrador
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (!isAdministrador(usuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Apenas administradores podem atualizar serviços"));
        }

        String nome = (String) dados.get("nome");
        String descricao = (String) dados.get("descricao");

        BigDecimal preco = dados.get("preco") instanceof Number
                ? new BigDecimal(dados.get("preco").toString())
                : null;

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome do serviço é obrigatório");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Informe um preço válido para o serviço");
        }

        Servico servico = servicoService.atualizar(
                id, nome, descricao, preco
        );

        return ResponseEntity.ok(converterResposta(servico));
    }

    // Alterar status: somente administrador
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (!isAdministrador(usuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Apenas administradores podem alterar o status dos serviços"));
        }

        if (!(dados.get("ativo") instanceof Boolean)) {
            throw new IllegalArgumentException(
                    "Informe ativo como true ou false"
            );
        }

        boolean ativo = (Boolean) dados.get("ativo");

        return ResponseEntity.ok(
                converterResposta(servicoService.alterarStatus(id, ativo))
        );
    }

    // Excluir serviço: somente administrador
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (!isAdministrador(usuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Apenas administradores podem excluir serviços"));
        }

        servicoService.excluir(id);

        return ResponseEntity.ok(
                Map.of("mensagem", "Serviço excluído com sucesso")
        );
    }

    // Monta a resposta enviada ao frontend
    private Map<String, Object> converterResposta(Servico servico) {

        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", servico.getId());
        resposta.put("nome", servico.getNome());
        resposta.put("descricao", servico.getDescricao());
        resposta.put("preco", servico.getPreco());
        resposta.put("ativo", servico.getAtivo());

        return resposta;
    }
}
