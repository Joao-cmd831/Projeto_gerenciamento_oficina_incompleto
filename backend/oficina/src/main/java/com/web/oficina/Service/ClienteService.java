package com.web.oficina.Service;

import com.web.oficina.Model.Cliente;
import com.web.oficina.Model.Usuario;
import com.web.oficina.Repository.ClienteRepository;
import com.web.oficina.Repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository) {

        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /* Busca o cliente pelo ID */
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Cliente não encontrado"
                )
            );
    }

    /* Busca o cliente pelo ID do usuário associado */
    public Cliente buscarPorUsuarioId(Long usuarioId) {
        return clienteRepository.findByUsuario_Id(usuarioId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Cadastro de cliente não encontrado"
                )
            );
    }

    /* Lista todos os clientes */
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    /* Cadastra um novo cliente */
    public Cliente cadastrar(
            Long usuarioId,
            String nome,
            String cpf,
            String telefone,
            String endereco) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Usuário não encontrado"
                )
            );

        if (clienteRepository.existsByUsuario_Id(usuarioId)) {
            throw new IllegalArgumentException(
                "Este usuário já possui um cadastro de cliente"
            );
        }

        Cliente cliente = new Cliente();

        cliente.setUsuario(usuario);
        cliente.setNome(nome);
        cliente.setCpf(cpf);
        cliente.setTelefone(telefone);
        cliente.setEndereco(endereco);

        return clienteRepository.save(cliente);
    }

    /* Atualiza os dados de um cliente */
    public Cliente atualizar(
            Long id,
            String nome,
            String cpf,
            String telefone,
            String endereco) {

        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Cliente não encontrado"
                )
            );

        cliente.setNome(nome);
        cliente.setCpf(cpf);
        cliente.setTelefone(telefone);
        cliente.setEndereco(endereco);

        return clienteRepository.save(cliente);
    }

    /* Exclui um cliente */
    public void excluir(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }
}
