
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Categoria } from '../../models/models';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {

  categorias: Categoria[] = [];

  categoria: string = '';

  idCategoria: number | null = null;

  mostrarFormulario: boolean = false;
  carregando: boolean = false;

  erro: string = '';
  sucesso: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  // LISTAR CATEGORIAS
  listarCategorias(): void {

    this.carregando = true;
    this.erro = '';

    this.api.categorias().subscribe({

      next: (dados) => {
        this.categorias = dados;
        this.carregando = false;
      },

      error: (erro) => {
        console.error(erro);
        this.erro = 'Erro ao carregar categorias.';
        this.carregando = false;
      }

    });
  }

  // ABRIR FORMULÁRIO PARA NOVA CATEGORIA
  novaCategoria(): void {

    this.categoria = '';
    this.idCategoria = null;
    this.erro = '';
    this.sucesso = '';

    this.mostrarFormulario = true;
  }

  // SALVAR CATEGORIA
  salvarCategoria(): void {

    if (!this.categoria.trim()) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    const dados = {
      categoria: this.categoria.trim()
    };

    // CADASTRAR
    if (this.idCategoria === null) {

      this.api.criarCategoria(dados).subscribe({

        next: () => {
          this.sucesso = 'Categoria cadastrada com sucesso!';
          this.listarCategorias();
          this.cancelarFormulario();
          this.sucesso = 'Categoria cadastrada com sucesso!';
        },

        error: (erro) => {
          console.error(erro);
          this.erro = 'Erro ao cadastrar categoria.';
        }

      });

    } else {

      // ATUALIZAR
      this.api.atualizarCategoria(this.idCategoria, dados).subscribe({

        next: () => {
          this.listarCategorias();
          this.cancelarFormulario();
          this.sucesso = 'Categoria atualizada com sucesso!';
        },

        error: (erro) => {
          console.error(erro);
          this.erro = 'Erro ao atualizar categoria.';
        }

      });

    }

  }

  // PREPARAR EDIÇÃO
  editarCategoria(categoria: Categoria): void {

    this.idCategoria = categoria.idcategoria!;
    this.categoria = categoria.categoria;

    this.mostrarFormulario = true;

    this.erro = '';
    this.sucesso = '';
  }

  // EXCLUIR CATEGORIA
  excluirCategoria(id: number): void {

    if (!confirm('Deseja realmente excluir esta categoria?')) {
      return;
    }

    this.api.excluirCategoria(id).subscribe({

      next: () => {
        this.sucesso = 'Categoria excluída com sucesso!';
        this.listarCategorias();
      },

      error: (erro) => {
        console.error(erro);

        if (erro.status === 409) {
          this.erro = 'Não é possível excluir. Esta categoria está vinculada a um item.';
        } else {
          this.erro = 'Erro ao excluir categoria.';
        }

      }

    });

  }

  // CANCELAR FORMULÁRIO
  cancelarFormulario(): void {

    this.mostrarFormulario = false;
    this.categoria = '';
    this.idCategoria = null;

  }

}
