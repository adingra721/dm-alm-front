import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-financial-ratings',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './financial-ratings.component.html',
  styleUrl: './financial-ratings.component.css'
})
export class FinancialRatingsComponent {
  readonly entityKey = 'financialRatings';
}
