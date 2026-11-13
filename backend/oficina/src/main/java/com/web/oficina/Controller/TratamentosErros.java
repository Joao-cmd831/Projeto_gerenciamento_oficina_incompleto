package com.web.oficina.Controller;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratamentosErros {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarViolacaoDeIntegridade(
            DataIntegrityViolationException erro) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "erro",
                        "Conflito com os dados existentes no banco"
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarDadosInvalidos(
            MethodArgumentNotValidException erro) {

        String mensagem = erro.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Dados inválidos");

        return ResponseEntity.badRequest()
                .body(Map.of("erro", mensagem));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> tratarArgumentoInvalido(
            IllegalArgumentException erro) {

        String mensagem = erro.getMessage() != null
                ? erro.getMessage()
                : "Dados inválidos";

        HttpStatus status = mensagem.contains("não encontrado")
                ? HttpStatus.NOT_FOUND
                : HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status)
                .body(Map.of("erro", mensagem));
    }
}


