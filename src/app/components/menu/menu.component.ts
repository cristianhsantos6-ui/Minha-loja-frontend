
import { Component, Output, EventEmitter } from '@angular/core';

export type Aba = 'inicio' | 'produtos' | 'clientes' | 'atendimentos' | 'categorias';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() abaSelecionada = new EventEmitter<Aba>();

  selecionarAba(aba: Aba): void {
    this.abaSelecionada.emit(aba);
  }
}
