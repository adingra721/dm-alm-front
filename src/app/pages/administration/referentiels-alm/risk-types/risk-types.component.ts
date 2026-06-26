import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-risk-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './risk-types.component.html',
  styleUrl: './risk-types.component.css'
})
export class RiskTypesComponent {
  readonly entityKey = 'riskTypes';
}
