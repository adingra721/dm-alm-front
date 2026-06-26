import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-provision-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './provision-types.component.html',
  styleUrl: './provision-types.component.css'
})
export class ProvisionTypesComponent {
  readonly entityKey = 'provisionTypes';
}
