import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-mortality-tables',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './mortality-tables.component.html',
  styleUrl: './mortality-tables.component.css'
})
export class MortalityTablesComponent {
  readonly entityKey = 'mortalityTables';
}
