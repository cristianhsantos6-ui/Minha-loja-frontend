export interface Produto {
  iditem?: number;
  idItem?: number;
  idcategoria?: number;
  idCategoria?: number;
  item?: string;
  item1?: string;
  descricaoItem?: string;
  preco?: number | string;
  precoVenda?: number | string;
  tipoItem?: string;
  ativoProdutoServico?: string;
  codigoPreco?: number;
  unidade?: string;

  iditemNavigation?: {
    item1?: string;
    descricaoItem?: string;
    preco?: number;
    tipoItem?: string;
    idcategoria?: number;
    ativoProdutoServico?: string;
  };
}
export interface Pessoa {
  idpessoa?: number;
  idPessoa?: number;
  nome: string;
  cpf: number | string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number | string;
  ativoPessoa?: string;
  enderecos?: Endereco[];
}
export interface Endereco {
  idPessoa?: number;
  idEndereco?: number;
  cep?: string;
  CEP?: string;
  numero?: string;
  complemento?: string;
}
export interface Atendimento {
  idAtendimento?: number;
  idatendimento?: number;
  idPessoa: number;
  nomePessoa?: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens?: AtendimentoItem[];
}
export interface AtendimentoItem {
  idItem: number;
  idFuncionario: number;
  quantidade: number;
  valorUnitario: number;
}


export interface ItemCarrinho {
  iditem: number;
  nome: string;
  descricao: string;
  preco: number;
  tipo: 'P' | 'S';
  quantidade: number;
}

export interface Funcionario {
  idPessoa?: number;
  nome: string;
  cpf: number | string;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number | string;
  ativoPessoa?: string;

  cargo: string;
  dataAdmissao: string;

  enderecos?: Endereco[];

  // Campos usados no formulário
  cep?: string;
  numero?: number | string;
  complemento?: string;
}

export interface Categoria {
  idcategoria?: number;
  categoria: string;
}

// ESTOQUE
export interface Estoque {
  iditem: number;
  quantidadeEstoque: number;
}

// ENTRADA DE PRODUTOS
export interface EntradaProduto {
  identradaProduto?: number;
  iditem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
}