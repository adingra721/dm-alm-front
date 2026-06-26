import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-insurance-branches',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './insurance-branches.component.html',
  styleUrl: './insurance-branches.component.css'
})
export class InsuranceBranchesComponent {
  readonly entityKey = 'insuranceBranches';
}
