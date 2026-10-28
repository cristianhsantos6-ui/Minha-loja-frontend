
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  formularioAberto: boolean = false;

  novoCliente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    ativoPessoa: 'S',
    enderecos: []
  };

  mensagem: string = '';
  erro: string = '';

  constructor(private apiService: ApiService) {}

  abrirFormulario(): void {
    this.formularioAberto = !this.formularioAberto;
    this.mensagem = '';
    this.erro = '';
  }

  salvarCliente(): void {
    this.mensagem = '';
    this.erro = '';

    if (!this.novoCliente.nome.trim()) {
      this.erro = 'Informe o nome do cliente.';
      return;
    }

    this.apiService.criarPessoa(this.novoCliente).subscribe({
      next: () => {
        this.mensagem = 'Cliente cadastrado com sucesso!';
        this.novoCliente = {
          nome: '',
          cpf: '',
          dataNascimento: '',
          sexo: '',
          email: '',
          telefone: '',
          ativoPessoa: 'S',
          enderecos: []
        };
        this.formularioAberto = false;
      },
      error: (err) => {
        console.error('Erro ao cadastrar cliente:', err);
        this.erro = 'Não foi possível cadastrar o cliente. Verifique os dados enviados.';
      }
    });
  }
}
