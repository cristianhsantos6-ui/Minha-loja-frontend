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
  iditemNavigation?: { item1?: string; descricaoItem?: string; preco?: number; tipoItem?: string; idcategoria?: number };
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
export interface Categoria {
  idcategoria?: number;
  idCategoria?: number;
  nomeCategoria?: string;
  categoria1?: string;
  nome?: string;
}