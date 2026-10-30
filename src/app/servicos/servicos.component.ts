
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Produto, Categoria } from '../models/models';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {

  servicos: Produto[] = [];
  categorias: Categoria[] = [];

  mostrarFormulario: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  erro: string = '';

  servicoEmEdicao: number | null = null;

  novoServico = {
    Idcategoria: 0,
    Item: '',
    DescricaoItem: '',
    Preco: 0,
    TipoItem: 'S',
    AtivoProdutoServico: 'S'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarServicos();
    this.carregarCategorias();
  }

  // LISTAR SERVIÇOS
  carregarServicos(): void {
    this.carregando = true;
    this.erro = '';

    this.apiService.servicos().subscribe({
      next: (dados) => {
        this.servicos = dados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar serviços:', err);
        this.erro = 'Não foi possível carregar os serviços.';
        this.carregando = false;
      }
    });
  }

  // CARREGAR CATEGORIAS
  carregarCategorias(): void {
    this.apiService.categorias().subscribe({
      next: (dados) => {
        this.categorias = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  // LIMPAR FORMULÁRIO
  limparFormulario(): void {
    this.novoServico = {
      Idcategoria: 0,
      Item: '',
      DescricaoItem: '',
      Preco: 0,
      TipoItem: 'S',
      AtivoProdutoServico: 'S'
    };

    this.servicoEmEdicao = null;
  }

  // PREPARAR SERVIÇO PARA EDIÇÃO
  editarServico(servico: Produto): void {
    this.servicoEmEdicao = servico.iditem ?? servico.idItem ?? null;

    this.novoServico = {
      Idcategoria: servico.idcategoria ?? 0,
      Item: servico.item1 ?? servico.item ?? '',
      DescricaoItem: servico.descricaoItem ?? '',
      Preco: Number(servico.preco ?? 0),
      TipoItem: 'S',
      AtivoProdutoServico: servico.ativoProdutoServico ?? 'S'
    };

    this.mostrarFormulario = true;
    this.erro = '';
  }

  // CADASTRAR OU ATUALIZAR SERVIÇO
  salvarServico(): void {
    this.erro = '';

    if (this.salvando) {
      return;
    }

    this.salvando = true;

    const dados = {
      ...this.novoServico,
      TipoItem: 'S'
    };

    const requisicao = this.servicoEmEdicao !== null
      ? this.apiService.atualizarServico(this.servicoEmEdicao, dados)
      : this.apiService.criarServico(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarFormulario = false;
        this.limparFormulario();
        this.carregarServicos();
      },
      error: (err) => {
        console.error('Erro ao salvar serviço:', err);

        this.erro =
          err.error?.mensagem ||
          (typeof err.error === 'string' ? err.error : '') ||
          'Não foi possível salvar o serviço.';

        this.salvando = false;
      }
    });
  }

  // DESATIVAR SERVIÇO
  desativarServico(id: number): void {
    const confirmar = confirm(
      'Tem certeza que deseja desativar este serviço?'
    );

    if (!confirmar) {
      return;
    }

    this.erro = '';

    this.apiService.desativarServico(id).subscribe({
      next: () => {
        this.carregarServicos();
      },
      error: (err) => {
        console.error('Erro ao desativar serviço:', err);
        this.erro = 'Não foi possível desativar o serviço.';
      }
    });
  }
}
