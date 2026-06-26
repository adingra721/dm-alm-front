import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-accounting-mappings',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './accounting-mappings.component.html',
  styleUrl: './accounting-mappings.component.css'
})
export class AccountingMappingsComponent {
  readonly entityKey = 'accountingMappings';
}
