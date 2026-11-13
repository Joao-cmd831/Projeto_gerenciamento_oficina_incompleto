package com.web.oficina.Controller;

import com.web.oficina.Model.Cliente;
import com.web.oficina.Model.Usuario;
import com.web.oficina.Service.ClienteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /* Verifica se o usuário autenticado é administrador */
    private boolean isAdministrador(Usuario usuario) {
        return "ADMINISTRADOR".equals(usuario.getTipo());
    }

    /* Monta a resposta com os dados do cliente */
    private Map<String, Object> respostaCliente(Cliente cliente) {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", cliente.getId());
        resposta.put("nome", cliente.getNome());
        resposta.put("cpf", cliente.getCpf());
        resposta.put("telefone",
            cliente.getTelefone() == null ? "" : cliente.getTelefone());
        resposta.put("endereco",
            cliente.getEndereco() == null ? "" : cliente.getEndereco());
        resposta.put("usuarioId", cliente.getUsuario().getId());

        return resposta;
    }

    /* Lista todos os clientes: somente administrador */
    @GetMapping
    public ResponseEntity<?> listar(Authentication authentication) {

        Usuario autenticado = (Usuario) authentication.getPrincipal();

        if (!isAdministrador(autenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("erro", "Apenas administradores podem listar clientes"));
        }

        List<Map<String, Object>> clientes = clienteService.listar()
            .stream()
            .map(this::respostaCliente)
            .toList();

        return ResponseEntity.ok(clientes);
    }

    /* Busca um cliente pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario autenticado = (Usuario) authentication.getPrincipal();

        Cliente cliente = clienteService.buscarPorId(id);

        boolean administrador = isAdministrador(autenticado);
        boolean donoDoCadastro =
            cliente.getUsuario().getId().equals(autenticado.getId());

        if (!administrador && !donoDoCadastro) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("erro", "Você não pode consultar este cadastro"));
        }

        return ResponseEntity.ok(respostaCliente(cliente));
    }

    /* Cadastra um cliente */
    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario autenticado = (Usuario) authentication.getPrincipal();

        Object valorUsuarioId = dados.get("usuarioId");

        String nome = (String) dados.get("nome");
        String cpf = (String) dados.get("cpf");
        String telefone = (String) dados.get("telefone");
        String endereco = (String) dados.get("endereco");

        if (nome == null || nome.isBlank()
                || cpf == null || cpf.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("erro", "Nome e CPF são obrigatórios"));
        }

        Long usuarioId;

        if (isAdministrador(autenticado)) {

            if (valorUsuarioId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("erro", "O usuarioId é obrigatório"));
            }

            try {
                usuarioId = Long.valueOf(valorUsuarioId.toString());
            } catch (NumberFormatException erro) {
                return ResponseEntity.badRequest()
                    .body(Map.of("erro", "O usuarioId deve ser numérico"));
            }

        } else if ("CLIENTE".equals(autenticado.getTipo())) {

            usuarioId = autenticado.getId();

            if (valorUsuarioId != null
                    && !usuarioId.equals(
                        Long.valueOf(valorUsuarioId.toString()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Você só pode cadastrar seu próprio perfil"));
            }

        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("erro", "Perfil sem permissão para cadastrar clientes"));
        }

        Cliente cliente = clienteService.cadastrar(
            usuarioId, nome, cpf, telefone, endereco
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(respostaCliente(cliente));
    }

    /* Atualiza os dados de um cliente */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dados,
            Authentication authentication) {

        Usuario autenticado = (Usuario) authentication.getPrincipal();

        Cliente clienteExistente = clienteService.buscarPorId(id);

        boolean administrador = isAdministrador(autenticado);
        boolean donoDoCadastro =
            clienteExistente.getUsuario().getId().equals(autenticado.getId());

        if (!administrador && !donoDoCadastro) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("erro", "Você não pode atualizar este cadastro"));
        }

        String nome = (String) dados.get("nome");
        String cpf = (String) dados.get("cpf");
        String telefone = (String) dados.get("telefone");
        String endereco = (String) dados.get("endereco");

        if (nome == null || nome.isBlank()
                || cpf == null || cpf.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("erro", "Nome e CPF são obrigatórios"));
        }

        Cliente cliente = clienteService.atualizar(
            id, nome, cpf, telefone, endereco
        );

        return ResponseEntity.ok(respostaCliente(cliente));
    }

    /* Exclui um cliente: somente administrador */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario autenticado = (Usuario) authentication.getPrincipal();

        if (!isAdministrador(autenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("erro", "Apenas administradores podem excluir clientes"));
        }

        clienteService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
