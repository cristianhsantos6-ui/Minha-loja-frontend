import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { Atendimento, Categoria, Pessoa, Produto } from './models/models';
import { CabecalhoComponent } from './components/cabecalho/cabecalho.component';
import { MenuComponent } from './components/menu/menu.component';

type Aba = 'inicio' | 'produtos' | 'clientes' | 'atendimentos' | 'categorias';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoComponent, MenuComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  today = new Date();
  aba: Aba = 'inicio';
  produtos: Produto[] = [];
  pessoas: Pessoa[] = [];
  atendimentos: Atendimento[] = [];
  categorias: Categoria[] = [];
  carregando = false;
  erro = '';
  sucesso = '';
  pesquisa = '';
  filtroCategoria = '';
  mostrarFormCliente = false;
  mostrarFormProduto = false;
  mostrarFormAtendimento = false;

  cliente: Pessoa = this.novoCliente();
  produto: any = this.novoProduto();
  atendimento: Atendimento = this.novoAtendimento();

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.carregarResumo(); }
  get produtosFiltrados(): Produto[] {
    return this.produtos.filter(p => {
      const nome = (p.item ?? p.item1 ?? p.iditemNavigation?.item1 ?? '').toLowerCase();
      const categoria = String(p.idCategoria ?? p.idcategoria ?? p.iditemNavigation?.idcategoria ?? '');
      return nome.includes(this.pesquisa.toLowerCase()) && (!this.filtroCategoria || categoria === this.filtroCategoria);
    });
  }
  get pessoasFiltradas(): Pessoa[] {
    return this.pessoas.filter(p => (p.nome ?? '').toLowerCase().includes(this.pesquisa.toLowerCase()));
  }
  carregarResumo(): void {
    this.carregarProdutos(); this.carregarPessoas(); this.carregarAtendimentos(); this.carregarCategorias();
  }
  mudarAba(aba: Aba): void {
    this.aba = aba; this.erro = ''; this.sucesso = ''; this.pesquisa = '';
    if (aba === 'produtos') this.carregarProdutos();
    if (aba === 'clientes') this.carregarPessoas();
    if (aba === 'atendimentos') this.carregarAtendimentos();
    if (aba === 'categorias') this.carregarCategorias();
  }
  carregarProdutos(): void {
    this.api.produtos().subscribe({ next: x => this.produtos = x ?? [], error: e => this.tratarErro(e, 'Não foi possível carregar os produtos.') });
  }
  carregarPessoas(): void {
    this.api.pessoas().subscribe({ next: x => this.pessoas = x ?? [], error: e => this.tratarErro(e, 'Não foi possível carregar os clientes.') });
  }
  carregarAtendimentos(): void {
    this.api.atendimentos().subscribe({ next: x => this.atendimentos = x ?? [], error: e => this.tratarErro(e, 'Não foi possível carregar os atendimentos.') });
  }
  carregarCategorias(): void {
    this.api.categorias().subscribe({ next: x => this.categorias = x ?? [], error: e => this.tratarErro(e, 'Não foi possível carregar as categorias.') });
  }
  novoCliente(): Pessoa { return { nome: '', cpf: '', dataNascimento: '', sexo: '', email: '', telefone: '', ativoPessoa: 'S', enderecos: [{ cep: '', numero: '', complemento: '' }] }; }
  novoProduto(): any { return { idCategoria: '', item: '', descricaoItem: '', preco: null, tipoItem: 'P', ativoProdutoServico: 'S', codigoPreco: 1, precoVenda: null, unidade: 'UN' }; }
  novoAtendimento(): Atendimento { return { idPessoa: 0, dataAtendimento: new Date().toISOString().slice(0,10), statusAtendimento: 'A', itens: [] }; }
  salvarCliente(): void {
    this.erro = ''; this.sucesso = '';
    if (!this.cliente.nome.trim() || !this.cliente.cpf || !this.cliente.email.trim() || !this.cliente.dataNascimento) {
      this.erro = 'Preencha nome, CPF, data de nascimento e e-mail.'; return;
    }
    this.api.criarPessoa(this.cliente).subscribe({
      next: () => { this.sucesso = 'Cliente cadastrado com sucesso.'; this.cliente = this.novoCliente(); this.mostrarFormCliente = false; this.carregarPessoas(); },
      error: e => this.tratarErro(e, 'Não foi possível cadastrar o cliente.')
    });
  }
  salvarProduto(): void {
    this.erro = ''; this.sucesso = '';
    if (!this.produto.item?.trim() || !this.produto.idCategoria || this.produto.preco === null || this.produto.preco === '') {
      this.erro = 'Informe categoria, nome e preço do item.'; return;
    }
    const dados = { ...this.produto, idCategoria: Number(this.produto.idCategoria), preco: Number(this.produto.preco), precoVenda: Number(this.produto.precoVenda ?? this.produto.preco) };
    this.api.criarProduto(dados).subscribe({
      next: () => { this.sucesso = 'Item cadastrado com sucesso.'; this.produto = this.novoProduto(); this.mostrarFormProduto = false; this.carregarProdutos(); },
      error: e => this.tratarErro(e, 'Não foi possível cadastrar o item.')
    });
  }
  salvarAtendimento(): void {
    this.erro = ''; this.sucesso = '';
    if (!this.atendimento.idPessoa || !this.atendimento.dataAtendimento || !this.atendimento.statusAtendimento) {
      this.erro = 'Informe o cliente, a data e a situação do atendimento.'; return;
    }
    this.api.criarAtendimento(this.atendimento).subscribe({
      next: () => { this.sucesso = 'Atendimento registrado.'; this.atendimento = this.novoAtendimento(); this.mostrarFormAtendimento = false; this.carregarAtendimentos(); },
      error: e => this.tratarErro(e, 'Não foi possível registrar o atendimento.')
    });
  }
  desativarCliente(p: Pessoa): void {
    const id = Number(p.idPessoa ?? p.idpessoa);
    if (!id || !confirm(`Deseja excluir/desativar ${p.nome}?`)) return;
    this.api.excluirPessoa(id).subscribe({
      next: () => { this.sucesso = 'Operação realizada.'; this.carregarPessoas(); },
      error: e => this.tratarErro(e, 'Não foi possível remover o cliente.')
    });
  }
  nomeProduto(p: Produto): string { return p.item ?? p.item1 ?? p.iditemNavigation?.item1 ?? `Item ${p.iditem ?? p.idItem ?? ''}`; }
  precoProduto(p: Produto): number { return Number(p.precoVenda ?? p.preco ?? p.iditemNavigation?.preco ?? 0); }
  idProduto(p: Produto): number { return Number(p.iditem ?? p.idItem ?? 0); }
  idCategoria(c: Categoria): number { return Number(c.idcategoria ?? c.idCategoria ?? 0); }
  nomeCategoria(c: Categoria): string { return c.nomeCategoria ?? c.categoria1 ?? c.nome ?? `Categoria ${this.idCategoria(c)}`; }
  nomeCliente(id: number): string { return this.pessoas.find(p => Number(p.idpessoa ?? p.idPessoa) === id)?.nome ?? `Cliente #${id}`; }
  private tratarErro(e: HttpErrorResponse, mensagem: string): void {
    this.erro = e.status === 0
      ? 'Não foi possível conectar à API. Confira se o backend está rodando, a URL e o CORS.'
      : `${mensagem} ${e.error?.mensagem ?? e.error?.title ?? e.message ?? ''}`.trim();
  }
}