import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Produto, ItemCarrinho } from '../../models/models';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {


  @Output() adicionarCarrinho = new EventEmitter<ItemCarrinho>();

  adicionarAoCarrinho(produto: Produto): void {
    const p = produto as any;
    const item = p.iditemNavigation || p;
  
    const novoItem: ItemCarrinho = {
      iditem: Number(p.iditem ?? p.idItem),
      nome: item.item1 ?? item.item ?? '',
      descricao: item.descricaoItem ?? '',
      preco: Number(p.precoVenda ?? item.preco ?? p.preco ?? 0),
      tipo: 'P',
      quantidade: 1
    };
  
    this.adicionarCarrinho.emit(novoItem);
  }


  produtos: Produto[] = [];

  mostrarFormulario: boolean = false;
  carregando: boolean = false;
  salvando: boolean = false;
  erro: string = '';
  produtoAtivo: boolean = true;

  // Guarda o ID do produto que está sendo editado.
  // Quando for null, significa que é um cadastro novo.
  produtoEmEdicao: number | null = null;

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

  // LISTAR PRODUTOS
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

  // LIMPAR O FORMULÁRIO
  limparFormulario(): void {
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
    this.produtoEmEdicao = null;
  }

  // PREPARAR UM PRODUTO PARA EDIÇÃO
  editarProduto(produto: Produto): void {

    // Acessa os dados recebidos da API.
    const p = produto as any;
    const item = p.iditemNavigation || p;

    this.produtoEmEdicao = p.iditem ?? p.idItem;

    this.novoProduto = {
      Idcategoria: p.idcategoria ?? item.idcategoria ?? 0,
      Item: item.item1 ?? item.item ?? '',
      DescricaoItem: item.descricaoItem ?? '',
      Preco: item.preco ?? 0,
      TipoItem: item.tipoItem ?? 'P',
      AtivoProdutoServico: item.ativoProdutoServico ?? 'S',
      CodigoPreco: p.codigoPreco ?? 1,
      PrecoVenda: p.precoVenda ?? 0,
      Unidade: p.unidade ?? 'UN'
    };

    this.produtoAtivo =
      this.novoProduto.AtivoProdutoServico === 'S';

    this.mostrarFormulario = true;
    this.erro = '';
  }

  // CADASTRAR OU ATUALIZAR PRODUTO
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

    // Se existe um ID, atualiza.
    // Se não existe, cadastra um novo produto.
    const requisicao = this.produtoEmEdicao !== null
      ? this.apiService.atualizarProduto(this.produtoEmEdicao, dados)
      : this.apiService.criarProduto(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarFormulario = false;
        this.limparFormulario();
        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao salvar produto:', err);

        this.erro =
          err.error?.mensagem ||
          (typeof err.error === 'string' ? err.error : '') ||
          'Não foi possível salvar o produto. Verifique os dados informados.';

        this.salvando = false;
      }
    });
  }

  // DESATIVAR PRODUTO
  desativarProduto(id: number): void {

    const confirmar = confirm(
      'Tem certeza que deseja desativar este produto?'
    );

    if (!confirmar) {
      return;
    }

    this.erro = '';

    this.apiService.desativarProduto(id).subscribe({
      next: () => {
        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao desativar produto:', err);

        this.erro =
          err.error?.mensagem ||
          'Não foi possível desativar o produto.';
      }
    });
  }
}