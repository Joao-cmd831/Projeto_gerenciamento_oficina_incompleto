
package com.web.oficina.Service;

import com.web.oficina.Model.Servico;
import com.web.oficina.Repository.ServicoRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    // Valida os dados básicos do serviço
    private void validarDados(String nome, BigDecimal preco) {

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome do serviço é obrigatório");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "O preço deve ser maior que zero");
        }
    }

    // Cadastrar um novo serviço
    public Servico cadastrar(
            String nome,
            String descricao,
            BigDecimal preco) {

        validarDados(nome, preco);

        if (servicoRepository.existsByNomeIgnoreCase(nome)) {
            throw new IllegalArgumentException(
                    "Já existe um serviço com esse nome");
        }

        Servico servico = new Servico();

        servico.setNome(nome.trim());
        servico.setDescricao(descricao);
        servico.setPreco(preco);
        servico.setAtivo(true);

        return servicoRepository.save(servico);
    }

    // Consultar todos os serviços
    public List<Servico> listar() {
        return servicoRepository.findAll();
    }

    // Buscar um serviço pelo ID
    public Servico buscarPorId(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado"));
    }

    // Atualizar os dados de um serviço
    public Servico atualizar(
            Long id,
            String nome,
            String descricao,
            BigDecimal preco) {

        Servico servico = buscarPorId(id);

        validarDados(nome, preco);

        String nomeAtual = servico.getNome().trim();
        String novoNome = nome.trim();

        if (!nomeAtual.equalsIgnoreCase(novoNome)
                && servicoRepository.existsByNomeIgnoreCase(novoNome)) {

            throw new IllegalArgumentException(
                    "Já existe outro serviço com esse nome");
        }

        servico.setNome(novoNome);
        servico.setDescricao(descricao);
        servico.setPreco(preco);

        return servicoRepository.save(servico);
    }

    // Ativar ou desativar um serviço
    public Servico alterarStatus(Long id, boolean ativo) {

        Servico servico = buscarPorId(id);

        servico.setAtivo(ativo);

        return servicoRepository.save(servico);
    }

    // Excluir serviço somente se não possuir histórico
    public void excluir(Long id) {

        Servico servico = buscarPorId(id);

        if (servicoRepository.contarUsos(id) > 0) {
            throw new IllegalArgumentException(
                    "Não é possível excluir um serviço vinculado a ordens de serviço");
        }

        servicoRepository.delete(servico);
    }
}
