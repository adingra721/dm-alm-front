import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-scenario-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './scenario-types.component.html',
  styleUrl: './scenario-types.component.css'
})
export class ScenarioTypesComponent {
  readonly entityKey = 'scenarioTypes';
}
