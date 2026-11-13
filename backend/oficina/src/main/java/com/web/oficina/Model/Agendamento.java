
package com.web.oficina.Model;

import jakarta.persistence.*;
import java.time.LocalDate; /*Data */
import java.time.LocalTime; /*Horário */
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_agendamento", nullable = false)
    private LocalDate dataAgendamento;

    @Column(nullable = false)
    private LocalTime horario;

    @Column(nullable = false, length = 30)
    private String status;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne /*conecta agendamento ao cliente ao veiculo */
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @ManyToMany
    @JoinTable(
    name = "agendamento_servico",
    joinColumns = @JoinColumn(name = "agendamento_id"),
    inverseJoinColumns = @JoinColumn(name = "servico_id")
    )

    private List<Servico> servicos = new ArrayList<>();

    public List<Servico> getServicos() {
    return servicos;
    }

    public void setServicos(List<Servico> servicos) {
    this.servicos = servicos;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDataAgendamento() {
        return dataAgendamento;
    }

    public void setDataAgendamento(LocalDate dataAgendamento) {
        this.dataAgendamento = dataAgendamento;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
  
}
