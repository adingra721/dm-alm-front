import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-exchange-rates',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './exchange-rates.component.html',
  styleUrl: './exchange-rates.component.css'
})
export class ExchangeRatesComponent {
  readonly entityKey = 'exchangeRates';
}
