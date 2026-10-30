import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCarrinho } from '../../models/models';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent {

  @Input() itens: ItemCarrinho[] = [];
  @Output() alterarQuantidade = new EventEmitter<{ iditem: number; quantidade: number }>();

@Output() removerItem = new EventEmitter<number>();


  get total(): number {
    return this.itens.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );
  }


  aumentarQuantidade(item: ItemCarrinho): void {
    this.alterarQuantidade.emit({
      iditem: item.iditem,
      quantidade: item.quantidade + 1
    });
  }
  
  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade <= 1) {
      return;
    }
  
    this.alterarQuantidade.emit({
      iditem: item.iditem,
      quantidade: item.quantidade - 1
    });
  }

  remover(item: ItemCarrinho): void {
    this.removerItem.emit(item.iditem);
  }


}