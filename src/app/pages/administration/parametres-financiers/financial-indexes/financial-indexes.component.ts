import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-financial-indexes',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './financial-indexes.component.html',
  styleUrl: './financial-indexes.component.css'
})
export class FinancialIndexesComponent {
  readonly entityKey = 'financialIndexes';
}
