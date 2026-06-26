import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-financial-asset-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './financial-asset-types.component.html',
  styleUrl: './financial-asset-types.component.css'
})
export class FinancialAssetTypesComponent {
  readonly entityKey = 'financialAssetTypes';
}
