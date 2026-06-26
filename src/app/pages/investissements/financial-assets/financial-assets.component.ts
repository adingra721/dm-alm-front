import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-financial-assets',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './financial-assets.component.html',
  styleUrl: './financial-assets.component.css'
})
export class FinancialAssetsComponent {
  readonly entityKey = 'financialAssets';
}
