
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Funcionario } from '../../models/models';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.css'
})
export class FuncionariosComponent implements OnInit {

  mostrarFormulario = false;

  funcionarios: Funcionario[] = [];

  pesquisa = '';

  erro = '';
  sucesso = '';

  funcionario: any = this.novoFuncionario();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  // LISTAR FUNCIONÁRIOS
  carregarFuncionarios(): void {
    this.api.funcionarios().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.erro = '';
      },
      error: (erro: any) => {
        console.error('Erro ao carregar funcionários:', erro);
        this.erro = 'Não foi possível carregar os funcionários.';
      }
    });
  }

  // CONVERTER DATAS
  converterData(data: string): string {

    if (!data) {
      return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }

    const partes = data.split('/');

    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    return data;
  }

  // FORMULÁRIO VAZIO
  novoFuncionario(): any {
    return {
      idPessoa: 0,
      idEndereco: 0,
      nome: '',
      cpf: '',
      dataNascimento: '',
      sexo: '',
      email: '',
      telefone: '',
      ativoPessoa: 'S',
      cargo: '',
      dataAdmissao: '',
      cep: '',
      numero: 0,
      complemento: ''
    };
  }

  // CADASTRAR OU ATUALIZAR FUNCIONÁRIO
  salvarFuncionario(): void {

    this.erro = '';
    this.sucesso = '';

    const dados: any = {
      idPessoa: Number(this.funcionario.idPessoa),
      nome: this.funcionario.nome,
      cpf: Number(this.funcionario.cpf),
      dataNascimento: this.converterData(this.funcionario.dataNascimento),
      sexo: this.funcionario.sexo,
      email: this.funcionario.email,
      telefone: Number(this.funcionario.telefone),
      ativoPessoa: 'S',
      cargo: this.funcionario.cargo,
      dataAdmissao: this.converterData(this.funcionario.dataAdmissao),

      enderecos: [
        {
          idEndereco: Number(this.funcionario.idEndereco),
          idPessoa: Number(this.funcionario.idPessoa),
          cep: this.funcionario.cep,
          numero: String(this.funcionario.numero),
          complemento: this.funcionario.complemento
        }
      ]
    };

    // MOSTRAR DADOS NO CONSOLE
    console.log('ID DA PESSOA:', dados.idPessoa);
    console.log('CPF ENVIADO:', dados.cpf);
    console.log('DADOS COMPLETOS:', dados);

    console.log(
      'OPERAÇÃO:',
      dados.idPessoa > 0 ? 'PUT - EDIÇÃO' : 'POST - CADASTRO'
    );

    // ESCOLHER ENTRE POST E PUT
    const requisicao = dados.idPessoa > 0
      ? this.api.atualizarFuncionario(dados.idPessoa, dados)
      : this.api.criarFuncionario(dados);

    // EXECUTAR REQUISIÇÃO
    requisicao.subscribe({

      next: () => {

        this.sucesso = dados.idPessoa > 0
          ? 'Funcionário atualizado com sucesso!'
          : 'Funcionário cadastrado com sucesso!';

        this.funcionario = this.novoFuncionario();

        this.mostrarFormulario = false;

        this.carregarFuncionarios();
      },

      error: (erro: any) => {

        console.error('Erro ao salvar funcionário:', erro);

        this.erro = erro.error?.mensagem
          || 'Não foi possível salvar o funcionário.';
      }

    });
  }

  // EDITAR FUNCIONÁRIO
  editarFuncionario(funcionario: any): void {

    const endereco = funcionario.enderecos?.[0]
      || funcionario.Enderecos?.[0];

    this.funcionario = {

      idPessoa: funcionario.idPessoa,
      idEndereco: endereco?.idEndereco ?? 0,

      nome: funcionario.nome,
      cpf: funcionario.cpf,
      dataNascimento: funcionario.dataNascimento?.substring(0, 10),
      sexo: funcionario.sexo,
      email: funcionario.email,
      telefone: funcionario.telefone,

      cargo: funcionario.cargo,
      dataAdmissao: funcionario.dataAdmissao?.substring(0, 10),

      cep: endereco?.cep ?? '',
      numero: endereco?.numero ?? 0,
      complemento: endereco?.complemento ?? ''

    };

    this.mostrarFormulario = true;
  }

  // EXCLUIR FUNCIONÁRIO
  excluirFuncionario(id: number): void {

    if (!confirm('Deseja realmente excluir este funcionário?')) {
      return;
    }

    this.api.excluirFuncionario(id).subscribe({

      next: () => {

        this.sucesso = 'Funcionário excluído com sucesso!';

        this.carregarFuncionarios();
      },

      error: (erro: any) => {

        console.error('Erro ao excluir funcionário:', erro);

        this.erro = erro.error?.mensagem
          || 'Não foi possível excluir o funcionário.';
      }

    });
  }

}
