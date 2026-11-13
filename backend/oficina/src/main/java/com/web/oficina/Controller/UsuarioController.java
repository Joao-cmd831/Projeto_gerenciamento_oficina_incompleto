package com.web.oficina.Controller;

import com.web.oficina.Model.Usuario;
import com.web.oficina.Model.UsuarioResposta;
import com.web.oficina.Repository.UsuarioRepository;
import com.web.oficina.Service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    public UsuarioController(
            UsuarioRepository usuarioRepository,
            UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }

    /*
     * Consulta uma conta.
     * Cliente consulta somente a propria conta.
     * Administrador pode consultar qualquer conta.
     */
    @GetMapping("/{id}")
public ResponseEntity<UsuarioResposta> buscarPorId(
        @PathVariable Long id,
        Authentication authentication) {

    Usuario autenticado = (Usuario) authentication.getPrincipal();

    // Administradores podem consultar qualquer usuario.
    // Clientes podem consultar somente a propria conta.
    if (!"ADMINISTRADOR".equals(autenticado.getTipo())
            && !autenticado.getId().equals(id)) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    Usuario usuario = usuarioService.buscarPorId(id);

    return ResponseEntity.ok(UsuarioResposta.de(usuario));
    }

    /*
     * Lista todas as contas.
     * A permissao de administrador e definida no SegurancaConfig.
     */
    @GetMapping
    public List<UsuarioResposta> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResposta::de)
                .toList();
    }

    /*
     * Cadastro publico.
     * O UsuarioService deve definir o tipo CLIENTE
     * independentemente do valor enviado na requisicao.
     */
    @PostMapping
    public ResponseEntity<UsuarioResposta> cadastrar(
            @Valid @RequestBody Usuario usuario) {

        Usuario novoUsuario = usuarioService.cadastrar(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UsuarioResposta.de(novoUsuario));
    }

    /* Exclusao de contas.
     A permissao de administrador e definida no SegurancaConfig.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        usuarioService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}