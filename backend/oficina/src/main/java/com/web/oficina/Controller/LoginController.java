package com.web.oficina.Controller;

import com.web.oficina.Model.LoginRequisicao;
import com.web.oficina.Model.LoginResposta;
import com.web.oficina.Model.Usuario;
import com.web.oficina.Service.TokenService;
import com.web.oficina.Service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final UsuarioService usuarioService;
    private final TokenService tokenService;

    public LoginController(
            UsuarioService usuarioService,
            TokenService tokenService) {
        this.usuarioService = usuarioService;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResposta> login(
            @Valid @RequestBody LoginRequisicao requisicao) {

        Usuario usuario = usuarioService.login(
            requisicao.email(),
            requisicao.senha()
        );

        String token = tokenService.gerarToken(usuario);

        LoginResposta resposta = new LoginResposta(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTipo(),
            token
        );

        return ResponseEntity.ok(resposta);
    }
}
