/*Validação de Dados */
/*Essas anotações validam os dados recebidos */
package com.web.oficina.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Este campo é obrigatório")
    private String nome;

    @NotBlank(message = "Este campo é obrigatório")
    @Email(message = "informe um email válido")
    private String email;

    @NotBlank(message = "Este campo é obrigatório")
    @Size(min = 8, message = "A senha deve ter pelo meno 8 Caracteres")
    private String senha;

    @NotBlank(message = "Tipo de usuário")
    private String tipo;

    public Long getId() {return id; }

    public String getNome() {return nome; }
    public void setNome(String nome) {this.nome = nome; }

    public String getEmail() {return email; }
    public void setEmail(String email) {this.email = email; }

    public String getSenha() {return senha; }
    public void setSenha(String senha) {this.senha = senha; }

    public String getTipo() {return tipo; }
    public void setTipo(String tipo) {this.tipo = tipo; }

}