package com.web.oficina.Model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequisicao(
    @NotBlank(message = "Este campo é obrigatório")
    @Email(message = "Informe um email válido")
    String email,

    @NotBlank(message = "Este campo é obrigatório")
    String senha
) {}