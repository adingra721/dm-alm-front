import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-contract-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './contract-types.component.html',
  styleUrl: './contract-types.component.css'
})
export class ContractTypesComponent {
  readonly entityKey = 'contractTypes';
}
