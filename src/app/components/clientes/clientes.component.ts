import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Endereco, Pessoa } from '../../models/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Pessoa[] = [];
  cliente: Pessoa = this.novoCliente();
  carregando = false;
  salvando = false;
  mostrarFormulario = false;
  editandoId: number | null = null;
  erro = '';
  sucesso = '';
  pesquisa = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  get clientesFiltrados(): Pessoa[] {
    const termo = this.pesquisa.trim().toLowerCase();
    if (!termo) return this.clientes;
    return this.clientes.filter(c =>
      (c.nome ?? '').toLowerCase().includes(termo) ||
      String(c.cpf ?? '').includes(termo) ||
      (c.email ?? '').toLowerCase().includes(termo)
    );
  }

  novoCliente(): Pessoa {
    return {
      nome: '',
      cpf: '',
      dataNascimento: '',
      sexo: 'M',
      email: '',
      telefone: '',
      ativoPessoa: 'S',
      enderecos: [{ cep: '', numero: '', complemento: '' }]
    };
  }

  carregarClientes(): void {
    this.carregando = true;
    this.erro = '';
    this.api.pessoas().subscribe({
      next: dados => {
        this.clientes = dados ?? [];
        this.carregando = false;
      },
      error: e => {
        this.erro = this.mensagemErro(e, 'Não foi possível carregar os clientes.');
        this.carregando = false;
      }
    });
  }

  novoCadastro(): void {
    this.cliente = this.novoCliente();
    this.editandoId = null;
    this.mostrarFormulario = true;
    this.erro = '';
    this.sucesso = '';
  }

  editarCliente(pessoa: Pessoa): void {
    const id = Number(pessoa.idPessoa ?? pessoa.idpessoa);
    if (!id) {
      this.erro = 'Não foi possível identificar o ID deste cliente.';
      return;
    }

    this.api.pessoa(id).subscribe({
      next: dados => {
        this.cliente = {
          ...dados,
          cpf: String(dados.cpf ?? ''),
          telefone: String(dados.telefone ?? ''),
          enderecos: (dados.enderecos?.length ? dados.enderecos : [{ cep: '', numero: '', complemento: '' }])
            .map(e => ({ ...e }))
        };
        this.editandoId = id;
        this.mostrarFormulario = true;
        this.erro = '';
        this.sucesso = '';
      },
      error: e => this.erro = this.mensagemErro(e, 'Não foi possível carregar os dados para edição.')
    });
  }

  salvarCliente(): void {
    this.erro = '';
    this.sucesso = '';

    if (!this.cliente.nome.trim() || !String(this.cliente.cpf).trim() ||
        !this.cliente.dataNascimento || !this.cliente.email.trim() ||
        !String(this.cliente.telefone).trim()) {
      this.erro = 'Preencha nome, CPF, data de nascimento, e-mail e telefone.';
      return;
    }

    const enderecoOriginal: Endereco = this.cliente.enderecos?.[0] ?? {};
    if (!enderecoOriginal.cep?.trim() || !enderecoOriginal.numero?.trim()) {
      this.erro = 'Preencha o CEP e o número do endereço.';
      return;
    }

    // O backend recebe CPF e telefone como números (ulong) e exige pelo menos um endereço.
    const dados: Pessoa = {
      ...this.cliente,
      cpf: Number(String(this.cliente.cpf).replace(/\D/g, '')),
      telefone: Number(String(this.cliente.telefone).replace(/\D/g, '')),
      ativoPessoa: this.cliente.ativoPessoa || 'S',
      enderecos: this.cliente.enderecos?.map(e => ({
        ...(e.idEndereco ? { idEndereco: e.idEndereco } : {}),
        ...(e.idPessoa ? { idPessoa: e.idPessoa } : {}),
        cep: String(e.cep ?? '').replace(/\D/g, ''),
        numero: e.numero ?? '',
        complemento: e.complemento ?? ''
      }))
    };

    if (!Number.isFinite(Number(dados.cpf)) || !Number.isFinite(Number(dados.telefone))) {
      this.erro = 'CPF e telefone devem conter apenas números.';
      return;
    }

    this.salvando = true;
    const pedido = this.editandoId
      ? this.api.atualizarPessoa(this.editandoId, dados)
      : this.api.criarPessoa(dados);

    pedido.subscribe({
      next: () => {
        this.sucesso = this.editandoId
          ? 'Cliente atualizado com sucesso.'
          : 'Cliente cadastrado com sucesso.';
        this.salvando = false;
        this.mostrarFormulario = false;
        this.editandoId = null;
        this.cliente = this.novoCliente();
        this.carregarClientes();
      },
      error: e => {
        this.erro = this.mensagemErro(e, 'Não foi possível salvar o cliente.');
        this.salvando = false;
      }
    });
  }

  excluirCliente(pessoa: Pessoa): void {
    const id = Number(pessoa.idPessoa ?? pessoa.idpessoa);
    if (!id || !confirm(`Deseja realmente excluir o cliente "${pessoa.nome}"?`)) return;

    this.erro = '';
    this.sucesso = '';
    this.api.excluirPessoa(id).subscribe({
      next: () => {
        this.sucesso = 'Cliente excluído com sucesso.';
        this.carregarClientes();
      },
      error: e => this.erro = this.mensagemErro(e, 'Não foi possível excluir o cliente. Ele pode estar ligado a atendimentos ou a um funcionário.')
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.cliente = this.novoCliente();
    this.erro = '';
  }

  private mensagemErro(e: HttpErrorResponse, padrao: string): string {
    if (e.status === 0) {
      return 'Não foi possível conectar à API. Confira se o backend está rodando em https://localhost:7093 e se o navegador confia no certificado HTTPS.';
    }
    return e.error?.mensagem ?? e.error?.title ?? `${padrao} (HTTP ${e.status})`;
  }
}
