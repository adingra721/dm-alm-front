import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-asset-ratings',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './asset-ratings.component.html',
  styleUrl: './asset-ratings.component.css'
})
export class AssetRatingsComponent {
  readonly entityKey = 'assetRatings';
}
