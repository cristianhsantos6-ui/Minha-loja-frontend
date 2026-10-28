import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atendimento, Categoria, Pessoa, Produto } from '../models/models';

// Altere esta URL se o endereço HTTPS da sua API for diferente.
const API = 'https://localhost:7093/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  produtos(): Observable<Produto[]> { return this.http.get<Produto[]>(`${API}/ProdutoItem`); }
  produto(id: number): Observable<Produto> { return this.http.get<Produto>(`${API}/ProdutoItem/${id}`); }
  criarProduto(dados: unknown): Observable<unknown> { return this.http.post(`${API}/ProdutoItem`, dados); }

  pessoas(): Observable<Pessoa[]> { return this.http.get<Pessoa[]>(`${API}/PessoaEndereco`); }
  pessoa(id: number): Observable<Pessoa> { return this.http.get<Pessoa>(`${API}/PessoaEndereco/${id}`); }
  criarPessoa(dados: Pessoa): Observable<unknown> { return this.http.post(`${API}/PessoaEndereco`, dados); }
  atualizarPessoa(id: number, dados: Pessoa): Observable<unknown> { return this.http.put(`${API}/PessoaEndereco/${id}`, dados); }
  excluirPessoa(id: number): Observable<unknown> { return this.http.delete(`${API}/PessoaEndereco/${id}`); }

  atendimentos(): Observable<Atendimento[]> { return this.http.get<Atendimento[]>(`${API}/Atendimento`); }
  criarAtendimento(dados: Atendimento): Observable<unknown> { return this.http.post(`${API}/Atendimento`, dados); }

  categorias(): Observable<Categoria[]> { return this.http.get<Categoria[]>(`${API}/Categorium`); }
}