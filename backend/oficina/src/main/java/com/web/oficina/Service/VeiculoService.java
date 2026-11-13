
package com.web.oficina.Service;

import com.web.oficina.Model.Cliente;
import com.web.oficina.Model.Veiculo;
import com.web.oficina.Repository.ClienteRepository;
import com.web.oficina.Repository.VeiculoRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final ClienteRepository clienteRepository;

    public VeiculoService(
            VeiculoRepository veiculoRepository,
            ClienteRepository clienteRepository) {
        this.veiculoRepository = veiculoRepository;
        this.clienteRepository = clienteRepository;
    }

    /* Cadastrar veículo */
    public Veiculo cadastrar(
            String placa, String marca, String modelo,
            Integer ano, String cor, Long clienteId) {

        if (veiculoRepository.existsByPlaca(placa)) {
            throw new IllegalArgumentException(
                "Já existe um veículo cadastrado com essa placa");
        }

        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() ->
                new IllegalArgumentException("Cliente não encontrado"));

        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca(placa);
        veiculo.setMarca(marca);
        veiculo.setModelo(modelo);
        veiculo.setAno(ano);
        veiculo.setCor(cor);
        veiculo.setCliente(cliente);

        return veiculoRepository.save(veiculo);
    }

    /* Listar todos os veículos */
    public List<Veiculo> listar() {
        return veiculoRepository.findAll();
    }

    /* Listar veículos de um cliente */
    public List<Veiculo> listarPorCliente(Long clienteId) {
        return veiculoRepository.findAllByCliente_Id(clienteId);
    }

    /* Buscar veículo pelo ID */
    public Veiculo buscarPorId(Long id) {
        return veiculoRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Veículo não encontrado"));
    }

    /* Buscar veículo pertencente a um cliente */
    public Veiculo buscarPorIdECliente(Long id, Long clienteId) {
        return veiculoRepository.findByIdAndCliente_Id(id, clienteId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Veículo não encontrado para este cliente"));
    }

    /* Atualizar veículo */
    public Veiculo atualizar(
            Long id, String placa, String marca, String modelo,
            Integer ano, String cor) {

        Veiculo veiculo = buscarPorId(id);

        verificarPlaca(veiculo, placa);

        veiculo.setPlaca(placa);
        veiculo.setMarca(marca);
        veiculo.setModelo(modelo);
        veiculo.setAno(ano);
        veiculo.setCor(cor);

        return veiculoRepository.save(veiculo);
    }

    /* Atualizar veículo de um cliente */
    public Veiculo atualizarDoCliente(
            Long id, Long clienteId,
            String placa, String marca, String modelo,
            Integer ano, String cor) {

        Veiculo veiculo = buscarPorIdECliente(id, clienteId);

        verificarPlaca(veiculo, placa);

        veiculo.setPlaca(placa);
        veiculo.setMarca(marca);
        veiculo.setModelo(modelo);
        veiculo.setAno(ano);
        veiculo.setCor(cor);

        return veiculoRepository.save(veiculo);
    }

    /* Verificar se a placa já pertence a outro veículo */
    private void verificarPlaca(Veiculo veiculo, String placa) {
        if (veiculoRepository.existsByPlaca(placa)
                && !veiculo.getPlaca().equalsIgnoreCase(placa)) {
            throw new IllegalArgumentException(
                "Já existe outro veículo com essa placa");
        }
    }

    /* Excluir veículo */
    public void excluir(Long id) {
        Veiculo veiculo = buscarPorId(id);
        verificarHistorico(id);
        veiculoRepository.delete(veiculo);
    }

    /* Excluir veículo pertencente a um cliente */
    public void excluirDoCliente(Long id, Long clienteId) {
        Veiculo veiculo = buscarPorIdECliente(id, clienteId);
        verificarHistorico(id);
        veiculoRepository.delete(veiculo);
    }

    /* Impedir exclusão quando existir histórico */
    private void verificarHistorico(Long id) {
        boolean possuiHistorico =
            veiculoRepository.contarAgendamentos(id) > 0
            || veiculoRepository.contarOrdensServico(id) > 0;

        if (possuiHistorico) {
            throw new IllegalArgumentException(
                "Não é possível excluir veículo com histórico");
        }
    }
}
