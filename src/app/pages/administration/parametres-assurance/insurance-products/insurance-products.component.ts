import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-insurance-products',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './insurance-products.component.html',
  styleUrl: './insurance-products.component.css'
})
export class InsuranceProductsComponent {
  readonly entityKey = 'insuranceProducts';
}
