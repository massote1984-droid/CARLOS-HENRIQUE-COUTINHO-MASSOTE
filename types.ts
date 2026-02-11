
export type StatusType = 'Estoque' | 'Rejeitado' | 'Embarcado' | 'Devolvido';

export interface StockEntry {
  id: string;
  // Campos de Entrada
  mes: string;
  chaveAcessoNF: string;
  nf: string;
  tonelada: number;
  valor: number;
  descricaoProduto: string;
  dataNF: string;
  dataDescarga: string;
  status: StatusType;
  fornecedor: string;
  placaVeiculo: string;
  container: string;
  destino: string;

  // Campos de Saída
  dataFaturamentoVLI?: string;
  cteVLI?: string;

  // Campos de Performance
  horaChegada?: string;
  horaEntrada?: string;
  horaSaida?: string;

  // Campos de Faturamento
  dataEmissaoNF?: string;
  cteIntertex?: string;
  dataEmissaoCTEIntertex?: string;
  cteTransportador?: string;
}

export interface StockSummary {
  supplier: string;
  count: number;
  totalTonnage: number;
}
