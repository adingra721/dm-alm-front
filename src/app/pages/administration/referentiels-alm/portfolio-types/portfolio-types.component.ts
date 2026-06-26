import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-portfolio-types',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './portfolio-types.component.html',
  styleUrl: './portfolio-types.component.css'
})
export class PortfolioTypesComponent {
  readonly entityKey = 'portfolioTypes';
}
