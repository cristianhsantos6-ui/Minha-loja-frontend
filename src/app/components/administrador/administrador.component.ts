
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

import { 
  Pessoa,
  Produto,
  Atendimento
} from '../../models/models';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent implements OnInit {

  // QUANTIDADES DO PAINEL
  totalClientes: number = 0;
  totalProdutos: number = 0;
  totalServicos: number = 0;
  totalPedidos: number = 0;

  // ESTOQUE
  totalEstoque: number | null = null;
  estoqueIntegrado: boolean = false;

  // CONTROLE DA TELA
  carregando: boolean = false;
  erro: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarResumo();
  }

  // CARREGAR INFORMAÇÕES DO PAINEL
  carregarResumo(): void {

    this.carregando = true;
    this.erro = '';

    forkJoin({

      // CLIENTES
      clientes: this.api.pessoas().pipe(
        catchError(() => {
          this.erro = 'Não foi possível carregar os clientes.';
          return of([] as Pessoa[]);
        })
      ),

      // PRODUTOS
      produtos: this.api.produtos().pipe(
        catchError(() => {
          this.erro = 'Não foi possível carregar os produtos.';
          return of([] as Produto[]);
        })
      ),

      // SERVIÇOS
      servicos: this.api.servicos().pipe(
        catchError(() => {
          this.erro = 'Não foi possível carregar os serviços.';
          return of([] as Produto[]);
        })
      ),

      // PEDIDOS (ATENDIMENTOS)
      pedidos: this.api.atendimentos().pipe(
        catchError(() => {
          this.erro = 'Não foi possível carregar os pedidos.';
          return of([] as Atendimento[]);
        })
      )

    }).subscribe({

      next: (dados) => {

        this.totalClientes = dados.clientes.length;
        this.totalProdutos = dados.produtos.length;
        this.totalServicos = dados.servicos.length;
        this.totalPedidos = dados.pedidos.length;

        this.carregando = false;

      },

      error: (erro) => {

        console.error(erro);
        this.erro = 'Erro ao carregar o painel administrativo.';
        this.carregando = false;

      }

    });

  }

}
