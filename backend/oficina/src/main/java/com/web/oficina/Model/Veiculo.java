
package com.web.oficina.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Este camppo é obrigatório")
    @Size(max = 10)
    @Column(nullable = false, unique = true, length = 10)
    private String placa; /*placa única definida no SQL */

    @NotBlank(message = "Este campo é obrigatório")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String marca;

    @NotBlank(message = "Este campo é obrigatório")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String modelo;

    private Integer ano;

    @Size(max = 30)
    @Column(length = 30)
    private String cor;

    @ManyToOne /*Vários veículos pode pertencer ao mesmo cliente */
    @JoinColumn(name = "cliente_id", nullable = false) /*Conecta o objeto a coluna */
    private Cliente cliente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
