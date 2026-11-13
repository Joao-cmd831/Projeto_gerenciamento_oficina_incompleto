package com.web.oficina.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "servico")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome do serviço: obrigatório e limitado a 100 caracteres
    @NotBlank(message = "O nome do serviço é obrigatório")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nome;

    // Descrição opcional, limitada a 255 caracteres
    @Size(max = 255)
    @Column(length = 255)
    private String descricao;

    // BigDecimal evita problemas de precisão com valores monetários
    @NotNull(message = "O preço é obrigatório")
    @DecimalMin(value = "0.00", inclusive = false,
            message = "O preço deve ser maior que zero")
    @Digits(integer = 8, fraction = 2)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    // Define se o serviço está disponível
    @Column(nullable = false)
    private Boolean ativo = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
