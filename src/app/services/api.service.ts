
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Atendimento,
  Categoria,
  Pessoa,
  Produto
} from '../models/models';

// Endereço principal da API
const API = 'https://localhost:7093/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  // PRODUTOS

  // Listar todos os produtos
  produtos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API}/Produtoitem`);
  }

  // Consultar um produto pelo ID
  produto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${API}/Produtoitem/${id}`);
  }

  // Cadastrar um produto
  criarProduto(dados: unknown): Observable<unknown> {
    return this.http.post(`${API}/Produtoitem`, dados);
  }

  // Atualizar um produto
  atualizarProduto(
    id: number,
    dados: unknown
  ): Observable<unknown> {
    return this.http.put(`${API}/Produtoitem/${id}`, dados);
  }

  // Desativar um produto
  desativarProduto(id: number): Observable<unknown> {
    return this.http.patch(
      `${API}/Produtoitem/${id}/desativar`,
      {}
    );
  }

  // CLIENTES / PESSOAS

  // Listar todas as pessoas
  pessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${API}/PessoaEndereco`);
  }

  // Consultar uma pessoa pelo ID
  pessoa(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${API}/PessoaEndereco/${id}`);
  }

  // Cadastrar uma pessoa
  criarPessoa(dados: Pessoa): Observable<unknown> {
    return this.http.post(`${API}/PessoaEndereco`, dados);
  }

  // Atualizar uma pessoa
  atualizarPessoa(
    id: number,
    dados: Pessoa
  ): Observable<unknown> {
    return this.http.put(`${API}/PessoaEndereco/${id}`, dados);
  }

  // Excluir uma pessoa
  excluirPessoa(id: number): Observable<unknown> {
    return this.http.delete(`${API}/PessoaEndereco/${id}`);
  }

  // ATENDIMENTOS

  // Listar atendimentos
  atendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${API}/Atendimento`);
  }

  // Cadastrar um atendimento
  criarAtendimento(
    dados: Atendimento
  ): Observable<unknown> {
    return this.http.post(`${API}/Atendimento`, dados);
  }

  // CATEGORIAS

  // Listar categorias
  categorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API}/Categorium`);
  }
}
