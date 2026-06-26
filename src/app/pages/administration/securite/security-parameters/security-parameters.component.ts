import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-security-parameters',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './security-parameters.component.html',
  styleUrl: './security-parameters.component.css'
})
export class SecurityParametersComponent {
  readonly entityKey = 'securityParameters';
}
