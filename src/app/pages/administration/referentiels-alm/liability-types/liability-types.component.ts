import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-liability-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './liability-types.component.html',
  styleUrl: './liability-types.component.css'
})
export class LiabilityTypesComponent {
  readonly entityKey = 'liabilityTypes';
}
