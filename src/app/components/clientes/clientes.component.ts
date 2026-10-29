
import { Component, OnInit } from '@angular/core';
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
export class ClientesComponent implements OnInit {

  formularioAberto: boolean = false;
  modoEdicao: boolean = false;
  idClienteEditando: number | null = null;

  clientes: any[] = [];

  novoCliente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    ativoPessoa: 'S',
    enderecos: [] as any[],
    cep: '',
    numero: '',
    complemento: ''
  };

  mensagem: string = '';
  erro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  // Carrega os clientes da API
  carregarClientes(): void {
    this.apiService.pessoas().subscribe({
      next: (dados) => {
        this.clientes = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.erro = 'Não foi possível carregar os clientes.';
      }
    });
  }

  // Abre o formulário para cadastrar um novo cliente
  abrirFormulario(): void {
    this.limparFormulario();
    this.formularioAberto = true;
    this.mensagem = '';
    this.erro = '';
  }

  // Preenche o formulário com os dados do cliente selecionado
  editarCliente(cliente: any): void {
    this.mensagem = '';
    this.erro = '';

    this.modoEdicao = true;
    this.idClienteEditando = cliente.idPessoa;

    const endereco = cliente.enderecos?.[0];

    this.novoCliente = {
      nome: cliente.nome ?? '',
      cpf: cliente.cpf ?? '',
      dataNascimento: cliente.dataNascimento
        ? String(cliente.dataNascimento).substring(0, 10)
        : '',
      sexo: cliente.sexo ?? '',
      email: cliente.email ?? '',
      telefone: cliente.telefone ?? '',
      ativoPessoa: cliente.ativoPessoa ?? 'S',
      enderecos: endereco
        ? [{
            idEndereco: endereco.idEndereco,
            cep: endereco.cep ?? '',
            numero: endereco.numero ?? '',
            complemento: endereco.complemento ?? ''
          }]
        : [],
      cep: endereco?.cep ?? '',
      numero: endereco?.numero ?? '',
      complemento: endereco?.complemento ?? ''
    };

    this.formularioAberto = true;
  }

  // Cadastra um cliente novo ou salva as alterações
  salvarCliente(): void {
    this.mensagem = '';
    this.erro = '';

    if (!this.novoCliente.nome.trim()) {
      this.erro = 'Informe o nome do cliente.';
      return;
    }

    if (!this.novoCliente.dataNascimento) {
      this.erro = 'Informe a data de nascimento.';
      return;
    }

    if (
      !this.novoCliente.cep.trim() ||
      !this.novoCliente.numero.trim()
    ) {
      this.erro = 'Informe o CEP e o número do endereço.';
      return;
    }

    const enderecos = this.modoEdicao
      ? this.novoCliente.enderecos.map((endereco: any) => ({
          idEndereco: endereco.idEndereco,
          cep: this.novoCliente.cep,
          numero: this.novoCliente.numero,
          complemento: this.novoCliente.complemento
        }))
      : [{
          cep: this.novoCliente.cep,
          numero: this.novoCliente.numero,
          complemento: this.novoCliente.complemento
        }];

    const dadosCliente = {
      nome: this.novoCliente.nome,
      cpf: this.novoCliente.cpf,
      dataNascimento: this.novoCliente.dataNascimento,
      sexo: this.novoCliente.sexo,
      email: this.novoCliente.email,
      telefone: this.novoCliente.telefone,
      ativoPessoa: this.novoCliente.ativoPessoa,
      enderecos: enderecos
    };

    // Se estiver editando, utiliza PUT
    if (this.modoEdicao && this.idClienteEditando !== null) {
      this.apiService.atualizarPessoa(
        this.idClienteEditando,
        dadosCliente as any
      ).subscribe({
        next: () => {
          this.mensagem = 'Cliente atualizado com sucesso!';
          this.finalizarOperacao();
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
          console.error('Detalhes da resposta:', err.error);

          this.erro =
            err.error?.mensagem ||
            'Não foi possível atualizar o cliente.';
        }
      });

    } else {
      // Se for novo, utiliza POST
      this.apiService.criarPessoa(dadosCliente as any).subscribe({
        next: () => {
          this.mensagem = 'Cliente cadastrado com sucesso!';
          this.finalizarOperacao();
        },
        error: (err) => {
          console.error('Erro ao cadastrar cliente:', err);
          console.error('Detalhes da resposta:', err.error);

          this.erro =
            err.error?.mensagem ||
            'Não foi possível cadastrar o cliente.';
        }
      });
    }
  }

  // Exclui um cliente após confirmação
  excluirCliente(cliente: any): void {
    const confirmar = confirm(
      `Tem certeza que deseja excluir o cliente ${cliente.nome}?`
    );

    if (!confirmar) {
      return;
    }

    this.mensagem = '';
    this.erro = '';

    this.apiService.excluirPessoa(cliente.idPessoa).subscribe({
      next: () => {
        this.mensagem = 'Cliente excluído com sucesso!';
        this.carregarClientes();
      },
      error: (err) => {
        console.error('Erro ao excluir cliente:', err);
        console.error('Detalhes da resposta:', err.error);

        this.erro =
          err.error?.mensagem ||
          'Não foi possível excluir o cliente.';
      }
    });
  }

  // Fecha o formulário após salvar
  finalizarOperacao(): void {
    this.limparFormulario();
    this.formularioAberto = false;
    this.carregarClientes();
  }

  // Cancela o formulário sem salvar
  cancelarFormulario(): void {
    this.limparFormulario();
    this.formularioAberto = false;
    this.mensagem = '';
    this.erro = '';
  }

  // Limpa os campos do formulário
  limparFormulario(): void {
    this.modoEdicao = false;
    this.idClienteEditando = null;

    this.novoCliente = {
      nome: '',
      cpf: '',
      dataNascimento: '',
      sexo: '',
      email: '',
      telefone: '',
      ativoPessoa: 'S',
      enderecos: [],
      cep: '',
      numero: '',
      complemento: ''
    };
  }
}
