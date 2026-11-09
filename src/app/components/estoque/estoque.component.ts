
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service'; 
import { Estoque, EntradaProduto } from '../../models/models';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.css'
})
export class EstoqueComponent implements OnInit {

  estoques: Estoque[] = [];
  entradas: EntradaProduto[] = [];

  mensagem = '';
  erro = '';

  pesquisaId: number | null = null;

  novaEntrada: EntradaProduto = {
    iditem: 0,
    dataEntradaProduto: '',
    quantidadeEntrada: 0,
    unidade: 'UN',
    valorUnitarioEntrada: 0
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarEstoque();
    this.carregarEntradas();
  }

  // Consultar todos os estoques
  carregarEstoque(): void {
    this.api.estoques().subscribe({
      next: (dados) => {
        this.estoques = dados;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o estoque.';
      }
    });
  }

  // Consultar entradas
  carregarEntradas(): void {
    this.api.entradas().subscribe({
      next: (dados) => {
        this.entradas = dados;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as entradas.';
      }
    });
  }

  // Consultar estoque por ID
  consultarPorId(): void {
    this.erro = '';
    this.mensagem = '';

    if (!this.pesquisaId || this.pesquisaId <= 0) {
      this.erro = 'Informe um ID válido.';
      return;
    }

    this.api.estoque(this.pesquisaId).subscribe({
      next: (dados) => {
        this.estoques = [dados];
        this.mensagem = 'Estoque encontrado com sucesso.';
      },
      error: () => {
        this.erro = 'Estoque não encontrado.';
      }
    });
  }

  // Cadastrar entrada de produto
  cadastrarEntrada(): void {
    this.erro = '';
    this.mensagem = '';

    if (
      this.novaEntrada.iditem <= 0 ||
      !this.novaEntrada.dataEntradaProduto ||
      this.novaEntrada.quantidadeEntrada <= 0 ||
      this.novaEntrada.valorUnitarioEntrada < 0
    ) {
      this.erro = 'Preencha os campos corretamente.';
      return;
    }

    this.api.criarEntrada(this.novaEntrada).subscribe({
      next: () => {
        this.mensagem = 'Entrada cadastrada e estoque atualizado com sucesso!';

        this.novaEntrada = {
          iditem: 0,
          dataEntradaProduto: '',
          quantidadeEntrada: 0,
          unidade: 'UN',
          valorUnitarioEntrada: 0
        };

        this.carregarEstoque();
        this.carregarEntradas();
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem ||
          'Não foi possível cadastrar a entrada.';
      }
    });
  }

  // Voltar a mostrar todos os estoques
  listarTodos(): void {
    this.pesquisaId = null;
    this.mensagem = '';
    this.erro = '';
    this.carregarEstoque();
  }
}
