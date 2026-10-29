
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Produto } from '../../models/models';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  produtos: Produto[] = [];

  mostrarFormulario: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  erro: string = '';
  produtoAtivo: boolean = true;

  novoProduto = {
    Idcategoria: 0,
    Item: '',
    DescricaoItem: '',
    Preco: 0,
    TipoItem: 'P',
    AtivoProdutoServico: 'S',
    CodigoPreco: 1,
    PrecoVenda: 0,
    Unidade: 'UN'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.apiService.produtos().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.erro = 'Não foi possível carregar os produtos.';
        this.carregando = false;
      }
    });
  }

  salvarProduto(): void {
    this.erro = '';

    if (this.salvando) {
      return;
    }

    this.salvando = true;

    const dados = {
      ...this.novoProduto,
      AtivoProdutoServico: this.produtoAtivo ? 'S' : 'N'
    };

    this.apiService.criarProduto(dados).subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarFormulario = false;

        this.novoProduto = {
          Idcategoria: 0,
          Item: '',
          DescricaoItem: '',
          Preco: 0,
          TipoItem: 'P',
          AtivoProdutoServico: 'S',
          CodigoPreco: 1,
          PrecoVenda: 0,
          Unidade: 'UN'
        };

        this.produtoAtivo = true;
        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao salvar produto:', err);

        this.erro =
          err.error?.mensagem ||
          (typeof err.error === 'string' ? err.error : '') ||
          'Não foi possível cadastrar o produto. Verifique os dados informados.';

        this.salvando = false;
      }
    });
  }
}
