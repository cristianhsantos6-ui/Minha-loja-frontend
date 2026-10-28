
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
  

  produtos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API}/Produtoitem`);
  }

  produto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${API}/Produtoitem/${id}`);
  }

  criarProduto(dados: unknown): Observable<unknown> {
    return this.http.post(`${API}/Produtoitem`, dados);
  }

  
  // CLIENTES / PESSOAS
  

  pessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${API}/PessoaEndereco`);
  }

  pessoa(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${API}/PessoaEndereco/${id}`);
  }

  criarPessoa(dados: Pessoa): Observable<unknown> {
    return this.http.post(`${API}/PessoaEndereco`, dados);
  }

  atualizarPessoa(
    id: number,
    dados: Pessoa
  ): Observable<unknown> {
    return this.http.put(`${API}/PessoaEndereco/${id}`, dados);
  }

  excluirPessoa(id: number): Observable<unknown> {
    return this.http.delete(`${API}/PessoaEndereco/${id}`);
  }

  
  // ATENDIMENTOS
  

  atendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${API}/Atendimento`);
  }

  criarAtendimento(
    dados: Atendimento
  ): Observable<unknown> {
    return this.http.post(`${API}/Atendimento`, dados);
  }

  
  // CATEGORIAS
  

  categorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API}/Categorium`);
  }
}
